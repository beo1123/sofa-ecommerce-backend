import { NotFoundError } from '../../../shared/errors/not-found.error.js';
import { DomainError } from '../../../shared/errors/domain.error.js';

export class OrderNotFoundError extends NotFoundError {
  constructor(message = 'Order not found') {
    super(message);
  }
}

export class OrderAccessDeniedError extends DomainError {
  constructor() {
    super('FORBIDDEN', 'You do not have access to this order', 403);
  }
}

export class InvalidOrderStatusError extends DomainError {
  constructor(message = 'Invalid order status transition') {
    super('INVALID_ORDER_STATUS', message, 400);
  }
}

export class OrderCannotBeCancelledError extends DomainError {
  constructor() {
    super('ORDER_CANNOT_BE_CANCELLED', 'Order can only be cancelled when status is CREATED', 400);
  }
}
