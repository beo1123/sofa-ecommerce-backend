import { DomainError } from '../../../shared/errors/domain.error.js';
import { ConflictError } from '../../../shared/errors/conflict.error.js';
import { NotFoundError } from '../../../shared/errors/not-found.error.js';

export class ProductNotFoundError extends NotFoundError {
  constructor(message = 'Product not found') {
    super(message);
  }
}

export class ProductAlreadyExistsError extends ConflictError {
  constructor(field: string, value: string) {
    super(`Product with ${field} "${value}" already exists`);
  }
}

export class InvalidProductSlugError extends DomainError {
  constructor(message = 'Product slug is invalid') {
    super('INVALID_PRODUCT_SLUG', message);
  }
}

export class ProductTitleTooShortError extends DomainError {
  constructor() {
    super('PRODUCT_TITLE_TOO_SHORT', 'Product title must be at least 2 characters');
  }
}
