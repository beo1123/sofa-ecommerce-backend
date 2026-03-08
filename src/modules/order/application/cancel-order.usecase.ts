import { OrderRepository } from '../domain/order.repository.js';
import {
  OrderNotFoundError,
  OrderAccessDeniedError,
  OrderCannotBeCancelledError,
} from './errors.js';

export interface CancelOrderInput {
  id: string;
  userId: string;
  isAdmin: boolean;
}

export class CancelOrderUseCase {
  constructor(private readonly repo: OrderRepository) {}

  async execute(input: CancelOrderInput): Promise<void> {
    const order = await this.repo.findById(input.id);
    if (!order) {
      throw new OrderNotFoundError();
    }

    if (!input.isAdmin && order.userId !== input.userId) {
      throw new OrderAccessDeniedError();
    }

    if (order.status !== 'CREATED') {
      throw new OrderCannotBeCancelledError();
    }

    await this.repo.updateStatus(input.id, 'CANCELLED');
  }
}
