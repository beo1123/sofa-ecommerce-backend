/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq, sql } from 'drizzle-orm';
import { db } from '../../../shared/db/pg.js';
import { coupons } from '../../../shared/db/schema.js';
import { CouponRepository } from '../domain/coupon.repository.js';
import { Coupon } from '../domain/coupon.entity.js';

export class PgCouponRepository implements CouponRepository {
  async findById(id: string): Promise<Coupon | null> {
    const rows = await db.select().from(coupons).where(eq(coupons.id, id)).limit(1);
    if (!rows.length) return null;
    return this.toEntity(rows[0]);
  }

  async findByCode(code: string): Promise<Coupon | null> {
    const rows = await db.select().from(coupons).where(eq(coupons.code, code)).limit(1);
    if (!rows.length) return null;
    return this.toEntity(rows[0]);
  }

  async create(coupon: Coupon): Promise<void> {
    await db.insert(coupons).values({
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
    });
  }

  async update(
    id: string,
    data: Partial<Omit<Coupon, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<void> {
    const updateData: any = { updatedAt: new Date() };
    const fields = [
      'code',
      'type',
      'amount',
      'percent',
      'description',
      'startsAt',
      'expiresAt',
      'usageLimit',
      'usagePerUser',
      'timesUsed',
      'active',
      'metadata',
    ] as const;
    for (const f of fields) {
      if ((data as any)[f] !== undefined) updateData[f] = (data as any)[f];
    }
    await db.update(coupons).set(updateData).where(eq(coupons.id, id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(coupons).where(eq(coupons.id, id));
  }

  async findAll(limit?: number, offset?: number): Promise<Coupon[]> {
    let query: any = db.select().from(coupons);
    if (limit !== undefined) query = query.limit(limit);
    if (offset !== undefined) query = query.offset(offset);
    const rows = await query;
    return rows.map((r: any) => this.toEntity(r));
  }

  async count(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(coupons);
    return Number(result[0].count);
  }

  async incrementUsage(id: string): Promise<void> {
    await db
      .update(coupons)
      .set({ timesUsed: sql`${coupons.timesUsed} + 1`, updatedAt: new Date() })
      .where(eq(coupons.id, id));
  }

  private toEntity(r: any): Coupon {
    return Coupon.create({
      id: r.id,
      code: r.code,
      type: r.type as 'FIXED' | 'PERCENT',
      amount: r.amount,
      percent: r.percent,
      description: r.description,
      startsAt: r.startsAt,
      expiresAt: r.expiresAt,
      usageLimit: r.usageLimit,
      usagePerUser: r.usagePerUser,
      timesUsed: r.timesUsed,
      active: r.active,
      metadata: r.metadata,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    });
  }
}
