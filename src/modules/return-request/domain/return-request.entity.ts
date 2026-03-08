import { randomUUID } from 'crypto';

export class ReturnRequest {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly orderItemId: string,
    public readonly reason: string,
    public readonly status: string,
    public readonly evidence: unknown | null,
    public readonly requestedAt: Date,
    public readonly processedAt: Date | null,
    public readonly metadata: unknown | null,
  ) {}

  static create(data: {
    id?: string;
    orderId: string;
    orderItemId: string;
    reason: string;
    status?: string;
    evidence?: unknown | null;
    requestedAt?: Date;
    processedAt?: Date | null;
    metadata?: unknown | null;
  }): ReturnRequest {
    return new ReturnRequest(
      data.id ?? randomUUID(),
      data.orderId,
      data.orderItemId,
      data.reason,
      data.status ?? 'PENDING',
      data.evidence ?? null,
      data.requestedAt ?? new Date(),
      data.processedAt ?? null,
      data.metadata ?? null,
    );
  }
}
