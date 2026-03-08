import { NotFoundError } from '../../../shared/errors/not-found.error.js';
import { DomainError } from '../../../shared/errors/domain.error.js';

export class AddressNotFoundError extends NotFoundError {
  constructor(message = 'Address not found') {
    super(message);
  }
}

export class AddressAccessDeniedError extends DomainError {
  constructor() {
    super('FORBIDDEN', 'You do not have access to this address', 403);
  }
}
