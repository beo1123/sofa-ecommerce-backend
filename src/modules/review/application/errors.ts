import { DomainError } from '../../../shared/errors/domain.error.js';
import { ConflictError } from '../../../shared/errors/conflict.error.js';
import { NotFoundError } from '../../../shared/errors/not-found.error.js';

export class ReviewNotFoundError extends NotFoundError {
  constructor(message = 'Review not found') {
    super(message);
  }
}

export class ReviewAlreadyExistsError extends ConflictError {
  constructor() {
    super('You have already reviewed this product');
  }
}

export class ReviewForbiddenError extends DomainError {
  constructor() {
    super('REVIEW_FORBIDDEN', 'You are not allowed to perform this action on this review', 403);
  }
}

export class ReviewInvalidRatingError extends DomainError {
  constructor() {
    super('REVIEW_INVALID_RATING', 'Rating must be between 1 and 5', 400);
  }
}
