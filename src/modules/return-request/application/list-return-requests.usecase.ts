import { ReturnRequestRepository } from '../domain/return-request.repository.js';

export interface ListReturnRequestsInput {
  userId: string;
  isAdmin: boolean;
  status?: string;
  limit?: number;
  offset?: number;
}

export interface ListReturnRequestsOutput {
  items: Array<{
    id: string;
    orderId: string;
    orderItemId: string;
    reason: string;
    status: string;
    evidence: unknown | null;
    requestedAt: Date;
    processedAt: Date | null;
    metadata: unknown | null;
  }>;
  total: number;
  limit: number;
  offset: number;
}

export class ListReturnRequestsUseCase {
  constructor(private readonly returnRequestRepo: ReturnRequestRepository) {}

  async execute(input: ListReturnRequestsInput): Promise<ListReturnRequestsOutput> {
    const limit = input.limit ?? 20;
    const offset = input.offset ?? 0;
    const userId = input.isAdmin ? undefined : input.userId;

    const [requests, total] = await Promise.all([
      this.returnRequestRepo.findAll({ userId, status: input.status, limit, offset }),
      this.returnRequestRepo.count({ userId, status: input.status }),
    ]);

    return {
      items: requests.map((r) => ({
        id: r.id,
        orderId: r.orderId,
        orderItemId: r.orderItemId,
        reason: r.reason,
        status: r.status,
        evidence: r.evidence,
        requestedAt: r.requestedAt,
        processedAt: r.processedAt,
        metadata: r.metadata,
      })),
      total,
      limit,
      offset,
    };
  }
}
