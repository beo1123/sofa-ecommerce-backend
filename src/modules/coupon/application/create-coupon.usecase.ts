import { randomUUID } from 'crypto';
import { CouponRepository } from '../domain/coupon.repository.js';
import { Coupon } from '../domain/coupon.entity.js';
import { CouponAlreadyExistsError, CouponInvalidError } from './errors.js';

export interface CreateCouponInput {
  code: string;
  type: 'FIXED' | 'PERCENT';
  amount?: number;
  percent?: number;
  description?: string;
  startsAt?: Date;
  expiresAt?: Date;
  usageLimit?: number;
  usagePerUser?: number;
  active?: boolean;
  metadata?: unknown;
}

export interface CreateCouponOutput {
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
}

export class CreateCouponUseCase {
  constructor(private readonly couponRepo: CouponRepository) {}

  async execute(input: CreateCouponInput): Promise<CreateCouponOutput> {
    if (!input.code || input.code.trim().length < 2) {
      throw new CouponInvalidError('Coupon code must be at least 2 characters');
    }

    if (input.type === 'FIXED' && (input.amount === undefined || input.amount <= 0)) {
      throw new CouponInvalidError('Fixed coupon must have a positive amount');
    }

    if (
      input.type === 'PERCENT' &&
      (input.percent === undefined || input.percent <= 0 || input.percent > 100)
    ) {
      throw new CouponInvalidError('Percent coupon must have a percent between 1 and 100');
    }

    const existing = await this.couponRepo.findByCode(input.code.trim().toUpperCase());
    if (existing) {
      throw new CouponAlreadyExistsError(input.code);
    }

    const id = randomUUID();
    const coupon = Coupon.create({
      id,
      code: input.code.trim().toUpperCase(),
      type: input.type,
      amount: input.amount !== undefined ? String(input.amount) : null,
      percent: input.percent ?? null,
      description: input.description ?? null,
      startsAt: input.startsAt ?? null,
      expiresAt: input.expiresAt ?? null,
      usageLimit: input.usageLimit ?? null,
      usagePerUser: input.usagePerUser ?? null,
      timesUsed: 0,
      active: input.active ?? true,
      metadata: input.metadata ?? null,
    });

    await this.couponRepo.create(coupon);

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
    };
  }
}
