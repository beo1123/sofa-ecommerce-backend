import { randomUUID } from 'crypto';
import { ReturnRequestRepository } from '../domain/return-request.repository.js';
import { ReturnRequest } from '../domain/return-request.entity.js';
import { ReturnRequestAlreadyExistsError } from './errors.js';

export interface CreateReturnRequestInput {
  orderId: string;
  orderItemId: string;
  reason: string;
  evidence?: unknown | null;
  metadata?: unknown | null;
}

export interface CreateReturnRequestOutput {
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

export class CreateReturnRequestUseCase {
  constructor(private readonly returnRequestRepo: ReturnRequestRepository) {}

  async execute(input: CreateReturnRequestInput): Promise<CreateReturnRequestOutput> {
    const existing = await this.returnRequestRepo.findByOrderItemId(input.orderItemId);
    if (existing) {
      throw new ReturnRequestAlreadyExistsError();
    }

    const request = ReturnRequest.create({
      id: randomUUID(),
      orderId: input.orderId,
      orderItemId: input.orderItemId,
      reason: input.reason,
      evidence: input.evidence ?? null,
      metadata: input.metadata ?? null,
    });

    await this.returnRequestRepo.create(request);

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
