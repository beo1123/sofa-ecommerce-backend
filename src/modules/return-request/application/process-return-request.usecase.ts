import { ReturnRequestRepository } from '../domain/return-request.repository.js';
import { ReturnRequestNotFoundError, InvalidReturnRequestStatusError } from './errors.js';

export interface ProcessReturnRequestInput {
  id: string;
  status: 'APPROVED' | 'REJECTED' | 'COMPLETED';
}

export interface ProcessReturnRequestOutput {
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

export class ProcessReturnRequestUseCase {
  constructor(private readonly returnRequestRepo: ReturnRequestRepository) {}

  async execute(input: ProcessReturnRequestInput): Promise<ProcessReturnRequestOutput> {
    const validStatuses = ['APPROVED', 'REJECTED', 'COMPLETED'];
    if (!validStatuses.includes(input.status)) {
      throw new InvalidReturnRequestStatusError(
        `Status must be one of: ${validStatuses.join(', ')}`,
      );
    }

    const request = await this.returnRequestRepo.findById(input.id);
    if (!request) {
      throw new ReturnRequestNotFoundError();
    }

    if (request.status !== 'PENDING' && input.status !== 'COMPLETED') {
      throw new InvalidReturnRequestStatusError(
        'Only PENDING requests can be APPROVED or REJECTED',
      );
    }

    if (input.status === 'COMPLETED' && request.status !== 'APPROVED') {
      throw new InvalidReturnRequestStatusError(
        'Only APPROVED requests can be marked as COMPLETED',
      );
    }

    const processedAt = new Date();
    await this.returnRequestRepo.updateStatus(input.id, input.status, processedAt);

    const updated = await this.returnRequestRepo.findById(input.id);
    if (!updated) throw new ReturnRequestNotFoundError();

    return {
      id: updated.id,
      orderId: updated.orderId,
      orderItemId: updated.orderItemId,
      reason: updated.reason,
      status: updated.status,
      evidence: updated.evidence,
      requestedAt: updated.requestedAt,
      processedAt: updated.processedAt,
      metadata: updated.metadata,
    };
  }
}
