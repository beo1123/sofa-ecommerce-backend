import { Order } from './order.entity.js';

export interface FindAllOptions {
  status?: string;
  limit?: number;
  offset?: number;
}

export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string, limit?: number, offset?: number): Promise<Order[]>;
  findAll(options?: FindAllOptions): Promise<Order[]>;
  create(order: Order): Promise<void>;
  updateStatus(id: string, status: string): Promise<void>;
}
