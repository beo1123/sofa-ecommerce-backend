import { DomainError } from '../../../shared/errors/domain.error.js';
import { ConflictError } from '../../../shared/errors/conflict.error.js';
import { NotFoundError } from '../../../shared/errors/not-found.error.js';

export class WishlistItemNotFoundError extends NotFoundError {
  constructor(message = 'Wishlist item not found') {
    super(message);
  }
}

export class WishlistItemAlreadyExistsError extends ConflictError {
  constructor() {
    super('This product is already in your wishlist');
  }
}

export class WishlistForbiddenError extends DomainError {
  constructor() {
    super('WISHLIST_FORBIDDEN', 'You are not allowed to modify this wishlist', 403);
  }
}
