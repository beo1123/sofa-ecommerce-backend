import { OrderRepository } from '../domain/order.repository.js';
import { Order } from '../domain/order.entity.js';

export interface ListOrdersInput {
  userId: string;
  isAdmin: boolean;
  status?: string;
  limit?: number;
  offset?: number;
}

export class ListOrdersUseCase {
  constructor(private readonly repo: OrderRepository) {}

  async execute(input: ListOrdersInput): Promise<Order[]> {
    const limit = input.limit ?? 20;
    const offset = input.offset ?? 0;

    if (input.isAdmin) {
      return this.repo.findAll({ status: input.status, limit, offset });
    }

    return this.repo.findByUserId(input.userId, limit, offset);
  }
}
