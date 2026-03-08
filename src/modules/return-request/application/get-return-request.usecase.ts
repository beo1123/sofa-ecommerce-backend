import { ReturnRequestRepository } from '../domain/return-request.repository.js';
import { ReturnRequestNotFoundError, ReturnRequestAccessDeniedError } from './errors.js';

export interface GetReturnRequestInput {
  id: string;
  userId: string;
  isAdmin: boolean;
}

export interface GetReturnRequestOutput {
  id: string;
  orderId: string;
  orderItemId: string;
  reason: string;
  status: string;
  evidence: unknown | null;
  requestedAt: Date;
  processedAt: Date | null;
  metadata: unknown | null;
}

export class GetReturnRequestUseCase {
  constructor(private readonly returnRequestRepo: ReturnRequestRepository) {}

  async execute(input: GetReturnRequestInput): Promise<GetReturnRequestOutput> {
    const request = await this.returnRequestRepo.findById(input.id);
    if (!request) {
      throw new ReturnRequestNotFoundError();
    }

    if (!input.isAdmin) {
      const userRequests = await this.returnRequestRepo.findAll({ userId: input.userId });
      const owned = userRequests.some((r) => r.id === input.id);
      if (!owned) {
        throw new ReturnRequestAccessDeniedError();
      }
    }

    return {
      id: request.id,
      orderId: request.orderId,
      orderItemId: request.orderItemId,
      reason: request.reason,
      status: request.status,
      evidence: request.evidence,
      requestedAt: request.requestedAt,
      processedAt: request.processedAt,
      metadata: request.metadata,
    };
  }
}
