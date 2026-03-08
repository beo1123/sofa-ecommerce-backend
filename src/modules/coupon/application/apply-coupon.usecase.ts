import { CouponRepository } from '../domain/coupon.repository.js';
import {
  CouponNotFoundError,
  CouponNotActiveError,
  CouponExpiredError,
  CouponUsageLimitError,
  CouponNotStartedError,
} from './errors.js';

export interface ApplyCouponInput {
  code: string;
  subtotal: number;
}

export interface ApplyCouponOutput {
  couponId: string;
  code: string;
  type: string;
  discountAmount: number;
  finalSubtotal: number;
}

export class ApplyCouponUseCase {
  constructor(private readonly couponRepo: CouponRepository) {}

  async execute(input: ApplyCouponInput): Promise<ApplyCouponOutput> {
    const coupon = await this.couponRepo.findByCode(input.code.trim().toUpperCase());
    if (!coupon) throw new CouponNotFoundError();

    if (!coupon.active) throw new CouponNotActiveError();

    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) throw new CouponNotStartedError();
    if (coupon.expiresAt && coupon.expiresAt < now) throw new CouponExpiredError();
    if (coupon.usageLimit !== null && coupon.timesUsed >= coupon.usageLimit)
      throw new CouponUsageLimitError();

    let discountAmount: number;
    if (coupon.type === 'FIXED') {
      discountAmount = Math.min(parseFloat(coupon.amount ?? '0'), input.subtotal);
    } else {
      discountAmount = (input.subtotal * (coupon.percent ?? 0)) / 100;
    }

    discountAmount = Math.round(discountAmount * 100) / 100;
    const finalSubtotal = Math.max(0, input.subtotal - discountAmount);

    return {
      couponId: coupon.id,
      code: coupon.code,
      type: coupon.type,
      discountAmount,
      finalSubtotal,
    };
  }
}
