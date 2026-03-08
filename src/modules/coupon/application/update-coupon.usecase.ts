import { CouponRepository } from '../domain/coupon.repository.js';
import { CouponNotFoundError, CouponInvalidError } from './errors.js';

export interface UpdateCouponInput {
  code?: string;
  type?: 'FIXED' | 'PERCENT';
  amount?: number | null;
  percent?: number | null;
  description?: string | null;
  startsAt?: Date | null;
  expiresAt?: Date | null;
  usageLimit?: number | null;
  usagePerUser?: number | null;
  active?: boolean;
  metadata?: unknown;
}

export interface UpdateCouponOutput {
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

export class UpdateCouponUseCase {
  constructor(private readonly couponRepo: CouponRepository) {}

  async execute(id: string, input: UpdateCouponInput): Promise<UpdateCouponOutput> {
    const coupon = await this.couponRepo.findById(id);
    if (!coupon) throw new CouponNotFoundError();

    if (
      input.type === 'FIXED' &&
      input.amount !== undefined &&
      input.amount !== null &&
      input.amount <= 0
    ) {
      throw new CouponInvalidError('Fixed coupon must have a positive amount');
    }
    if (
      input.type === 'PERCENT' &&
      input.percent !== undefined &&
      input.percent !== null &&
      (input.percent <= 0 || input.percent > 100)
    ) {
      throw new CouponInvalidError('Percent coupon must have a percent between 1 and 100');
    }

    const updateData: Record<string, unknown> = {};
    if (input.code !== undefined) updateData.code = input.code.trim().toUpperCase();
    if (input.type !== undefined) updateData.type = input.type;
    if (input.amount !== undefined)
      updateData.amount = input.amount !== null ? String(input.amount) : null;
    if (input.percent !== undefined) updateData.percent = input.percent;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.startsAt !== undefined) updateData.startsAt = input.startsAt;
    if (input.expiresAt !== undefined) updateData.expiresAt = input.expiresAt;
    if (input.usageLimit !== undefined) updateData.usageLimit = input.usageLimit;
    if (input.usagePerUser !== undefined) updateData.usagePerUser = input.usagePerUser;
    if (input.active !== undefined) updateData.active = input.active;
    if (input.metadata !== undefined) updateData.metadata = input.metadata;

    if (Object.keys(updateData).length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await this.couponRepo.update(id, updateData as any);
    }

    const updated = await this.couponRepo.findById(id);
    if (!updated) throw new CouponNotFoundError();

    return {
      id: updated.id,
      code: updated.code,
      type: updated.type,
      amount: updated.amount,
      percent: updated.percent,
      description: updated.description,
      startsAt: updated.startsAt,
      expiresAt: updated.expiresAt,
      usageLimit: updated.usageLimit,
      usagePerUser: updated.usagePerUser,
      timesUsed: updated.timesUsed,
      active: updated.active,
    };
  }
}
