import { DomainError } from '../../../shared/errors/domain.error.js';

export class EmailAlreadyExistsError extends DomainError {
  constructor() {
    super('EMAIL_ALREADY_EXISTS', 'This email address has already been registered.', 409); // 409 Conflict
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('INVALID_CREDENTIALS', 'Email or password is incorrect', 401); // 401 Unauthorized
  }
}
