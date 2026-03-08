import { OrderRepository } from '../domain/order.repository.js';
import { Order } from '../domain/order.entity.js';
import { OrderNotFoundError, OrderAccessDeniedError } from './errors.js';

export interface GetOrderInput {
  id: string;
  userId: string;
  isAdmin: boolean;
}

export class GetOrderUseCase {
  constructor(private readonly repo: OrderRepository) {}

  async execute(input: GetOrderInput): Promise<Order> {
    const order = await this.repo.findById(input.id);
    if (!order) {
      throw new OrderNotFoundError();
    }

    if (!input.isAdmin && order.userId !== input.userId) {
      throw new OrderAccessDeniedError();
    }

    return order;
  }
}
