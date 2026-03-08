import { DomainError } from '../../../shared/errors/domain.error.js';
import { NotFoundError } from '../../../shared/errors/not-found.error.js';
import { ConflictError } from '../../../shared/errors/conflict.error.js';

export class ReturnRequestNotFoundError extends NotFoundError {
  constructor(message = 'Return request not found') {
    super(message);
  }
}

export class ReturnRequestAlreadyExistsError extends ConflictError {
  constructor() {
    super('A return request for this order item already exists');
  }
}

export class ReturnRequestAccessDeniedError extends DomainError {
  constructor() {
    super('FORBIDDEN', 'You do not have access to this return request', 403);
  }
}

export class InvalidReturnRequestStatusError extends DomainError {
  constructor(message = 'Invalid return request status transition') {
    super('INVALID_RETURN_STATUS', message, 400);
  }
}
