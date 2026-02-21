import { DomainError } from '../../../shared/errors/domain.error.js';
import { ConflictError } from '../../../shared/errors/conflict.error.js';
import { NotFoundError } from '../../../shared/errors/not-found.error.js';

export class CategoryNotFoundError extends NotFoundError {
  constructor(message = 'Category not found') {
    super(message);
  }
}

export class CategoryAlreadyExistsError extends ConflictError {
  constructor(field: string, value: string) {
    super(`Category with ${field} "${value}" already exists`);
  }
}

export class InvalidCategorySlugError extends DomainError {
  constructor(message = 'Category slug is invalid') {
    super('INVALID_CATEGORY_SLUG', message);
  }
}

export class CategoryNameTooShortError extends DomainError {
  constructor() {
    super('CATEGORY_NAME_TOO_SHORT', 'Category name must be at least 2 characters');
  }
}
