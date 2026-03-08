export class Coupon {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly type: 'FIXED' | 'PERCENT',
    public readonly amount: string | null,
    public readonly percent: number | null,
    public readonly description: string | null,
    public readonly startsAt: Date | null,
    public readonly expiresAt: Date | null,
    public readonly usageLimit: number | null,
    public readonly usagePerUser: number | null,
    public readonly timesUsed: number,
    public readonly active: boolean,
    public readonly metadata: unknown,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(data: {
    id: string;
    code: string;
    type: 'FIXED' | 'PERCENT';
    amount?: string | null;
    percent?: number | null;
    description?: string | null;
    startsAt?: Date | null;
    expiresAt?: Date | null;
    usageLimit?: number | null;
    usagePerUser?: number | null;
    timesUsed?: number;
    active?: boolean;
    metadata?: unknown;
    createdAt?: Date;
    updatedAt?: Date;
  }): Coupon {
    return new Coupon(
      data.id,
      data.code,
      data.type,
      data.amount ?? null,
      data.percent ?? null,
      data.description ?? null,
      data.startsAt ?? null,
      data.expiresAt ?? null,
      data.usageLimit ?? null,
      data.usagePerUser ?? null,
      data.timesUsed ?? 0,
      data.active ?? true,
      data.metadata ?? null,
      data.createdAt,
      data.updatedAt,
    );
  }
}
