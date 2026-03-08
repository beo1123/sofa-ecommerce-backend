/* eslint-disable @typescript-eslint/no-explicit-any */
import { and, eq, sql } from 'drizzle-orm';
import { db } from '../../../shared/db/pg.js';
import { reviews } from '../../../shared/db/schema.js';
import { ReviewRepository } from '../domain/review.repository.js';
import { Review } from '../domain/review.entity.js';

export class PgReviewRepository implements ReviewRepository {
  async findById(id: string): Promise<Review | null> {
    const rows = await db.select().from(reviews).where(eq(reviews.id, id)).limit(1);
    if (!rows.length) return null;
    return this.toEntity(rows[0]);
  }

  async findByUserAndProduct(userId: string, productId: string): Promise<Review | null> {
    const rows = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.userId, userId), eq(reviews.productId, productId)))
      .limit(1);
    if (!rows.length) return null;
    return this.toEntity(rows[0]);
  }

  async findByProduct(
    productId: string,
    approvedOnly: boolean,
    limit?: number,
    offset?: number,
  ): Promise<Review[]> {
    let query: any = db
      .select()
      .from(reviews)
      .where(
        approvedOnly
          ? and(eq(reviews.productId, productId), eq(reviews.approved, true))
          : eq(reviews.productId, productId),
      );
    if (limit !== undefined) query = query.limit(limit);
    if (offset !== undefined) query = query.offset(offset);
    const rows = await query;
    return rows.map((r: any) => this.toEntity(r));
  }

  async findByUser(userId: string, limit?: number, offset?: number): Promise<Review[]> {
    let query: any = db.select().from(reviews).where(eq(reviews.userId, userId));
    if (limit !== undefined) query = query.limit(limit);
    if (offset !== undefined) query = query.offset(offset);
    const rows = await query;
    return rows.map((r: any) => this.toEntity(r));
  }

  async countByProduct(productId: string, approvedOnly: boolean): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(
        approvedOnly
          ? and(eq(reviews.productId, productId), eq(reviews.approved, true))
          : eq(reviews.productId, productId),
      );
    return Number(result[0].count);
  }

  async countByUser(userId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(eq(reviews.userId, userId));
    return Number(result[0].count);
  }

  async create(review: Review): Promise<void> {
    await db.insert(reviews).values({
      id: review.id,
      userId: review.userId,
      productId: review.productId,
      rating: review.rating,
      title: review.title,
      body: review.body,
      approved: review.approved,
    });
  }

  async update(
    id: string,
    data: { rating?: number; title?: string | null; body?: string | null; approved?: boolean },
  ): Promise<void> {
    const updateData: any = { updatedAt: new Date() };
    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.body !== undefined) updateData.body = data.body;
    if (data.approved !== undefined) updateData.approved = data.approved;
    await db.update(reviews).set(updateData).where(eq(reviews.id, id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(reviews).where(eq(reviews.id, id));
  }

  private toEntity(r: any): Review {
    return Review.create({
      id: r.id,
      userId: r.userId,
      productId: r.productId,
      rating: r.rating,
      title: r.title,
      body: r.body,
      approved: r.approved,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    });
  }
}
