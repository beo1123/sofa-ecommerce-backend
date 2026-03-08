import { ReturnRequest } from './return-request.entity.js';

export interface FindReturnRequestsOptions {
  userId?: string;
  orderId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export interface ReturnRequestRepository {
  findById(id: string): Promise<ReturnRequest | null>;
  findByOrderItemId(orderItemId: string): Promise<ReturnRequest | null>;
  create(request: ReturnRequest): Promise<void>;
  updateStatus(id: string, status: string, processedAt: Date): Promise<void>;
  findAll(options?: FindReturnRequestsOptions): Promise<ReturnRequest[]>;
  count(options?: Pick<FindReturnRequestsOptions, 'userId' | 'status'>): Promise<number>;
}
