import { OrderRepository } from '../domain/order.repository.js';
import { OrderNotFoundError, InvalidOrderStatusError } from './errors.js';

const VALID_STATUSES = ['CREATED', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED'];

export interface UpdateOrderStatusInput {
  id: string;
  status: string;
}

export class UpdateOrderStatusUseCase {
  constructor(private readonly repo: OrderRepository) {}

  async execute(input: UpdateOrderStatusInput): Promise<void> {
    if (!VALID_STATUSES.includes(input.status)) {
      throw new InvalidOrderStatusError(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    const order = await this.repo.findById(input.id);
    if (!order) {
      throw new OrderNotFoundError();
    }

    await this.repo.updateStatus(input.id, input.status);
  }
}
