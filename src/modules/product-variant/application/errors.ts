import { NotFoundError } from '../../../shared/errors/not-found.error.js';

export class ProductNotFoundError extends NotFoundError {
  constructor(message = 'Product not found') {
    super(message);
  }
}
