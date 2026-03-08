import { CouponRepository } from '../domain/coupon.repository.js';

export interface ListCouponsOutput {
  items: Array<{
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
    createdAt?: Date;
    updatedAt?: Date;
  }>;
  total: number;
  limit: number;
  offset: number;
}

export class ListCouponsUseCase {
  constructor(private readonly couponRepo: CouponRepository) {}

  async execute(limit = 20, offset = 0): Promise<ListCouponsOutput> {
    const [coupons, total] = await Promise.all([
      this.couponRepo.findAll(limit, offset),
      this.couponRepo.count(),
    ]);

    return {
      items: coupons.map((c) => ({
        id: c.id,
        code: c.code,
        type: c.type,
        amount: c.amount,
        percent: c.percent,
        description: c.description,
        startsAt: c.startsAt,
        expiresAt: c.expiresAt,
        usageLimit: c.usageLimit,
        usagePerUser: c.usagePerUser,
        timesUsed: c.timesUsed,
        active: c.active,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
      total,
      limit,
      offset,
    };
  }
}
