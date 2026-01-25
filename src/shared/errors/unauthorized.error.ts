import { DomainError } from './domain.error.js';

export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Yêu cầu đăng nhập') {
    super('UNAUTHORIZED', message, 401);
  }
}
