import { CouponRepository } from '../domain/coupon.repository.js';
import { CouponNotFoundError } from './errors.js';

export interface GetCouponOutput {
  id: string;
  code: string;
  type: string;
  amount: string | null;
  percent: number | null;
  description: string | null;
  startsAt: Date | null;
  expiresAt: Date | null;
  usageLimit: number | null;
  usagePerUser: number | null;
  timesUsed: number;
  active: boolean;
  metadata: unknown;
  createdAt?: Date;
  updatedAt?: Date;
}

export class GetCouponUseCase {
  constructor(private readonly couponRepo: CouponRepository) {}

  async execute(id: string): Promise<GetCouponOutput> {
    const coupon = await this.couponRepo.findById(id);
    if (!coupon) throw new CouponNotFoundError();
    return this.toOutput(coupon);
  }

  async executeByCode(code: string): Promise<GetCouponOutput> {
    const coupon = await this.couponRepo.findByCode(code.toUpperCase());
    if (!coupon) throw new CouponNotFoundError();
    return this.toOutput(coupon);
  }

  private toOutput(coupon: import('../domain/coupon.entity.js').Coupon): GetCouponOutput {
    return {
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      amount: coupon.amount,
      percent: coupon.percent,
      description: coupon.description,
      startsAt: coupon.startsAt,
      expiresAt: coupon.expiresAt,
      usageLimit: coupon.usageLimit,
      usagePerUser: coupon.usagePerUser,
      timesUsed: coupon.timesUsed,
      active: coupon.active,
      metadata: coupon.metadata,
      createdAt: coupon.createdAt,
      updatedAt: coupon.updatedAt,
    };
  }
}
