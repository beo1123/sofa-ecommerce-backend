import { DomainError } from '../../../shared/errors/domain.error.js';

export class EmailAlreadyExistsError extends DomainError {
  constructor() {
    super('EMAIL_ALREADY_EXISTS', 'Email này đã được đăng ký', 409); // 409 Conflict
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('INVALID_CREDENTIALS', 'Email hoặc mật khẩu không chính xác', 401); // 401 Unauthorized
  }
}
