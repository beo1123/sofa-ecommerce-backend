import { DomainError } from '../../../shared/errors/domain.error.js';
import { ConflictError } from '../../../shared/errors/conflict.error.js';
import { NotFoundError } from '../../../shared/errors/not-found.error.js';

export class CouponNotFoundError extends NotFoundError {
  constructor(message = 'Coupon not found') {
    super(message);
  }
}

export class CouponAlreadyExistsError extends ConflictError {
  constructor(code: string) {
    super(`Coupon with code "${code}" already exists`);
  }
}

export class CouponInvalidError extends DomainError {
  constructor(message: string) {
    super('COUPON_INVALID', message, 400);
  }
}

export class CouponExpiredError extends DomainError {
  constructor() {
    super('COUPON_EXPIRED', 'This coupon has expired', 400);
  }
}

export class CouponUsageLimitError extends DomainError {
  constructor() {
    super('COUPON_USAGE_LIMIT', 'This coupon has reached its usage limit', 400);
  }
}

export class CouponNotActiveError extends DomainError {
  constructor() {
    super('COUPON_NOT_ACTIVE', 'This coupon is not active', 400);
  }
}

export class CouponNotStartedError extends DomainError {
  constructor() {
    super('COUPON_NOT_STARTED', 'This coupon is not yet valid', 400);
  }
}
