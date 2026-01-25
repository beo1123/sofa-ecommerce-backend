import { DomainError } from './domain.error.js';

export class NotFoundError extends DomainError {
  constructor(resource: string = 'Resource') {
    super('NOT_FOUND', `${resource} không tồn tại`, 404);
  }
}
