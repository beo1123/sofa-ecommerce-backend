/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq, and } from 'drizzle-orm';
import { db } from '../../../shared/db/pg.js';
import { returnRequests, orders } from '../../../shared/db/schema.js';
import {
  ReturnRequestRepository,
  FindReturnRequestsOptions,
} from '../domain/return-request.repository.js';
import { ReturnRequest } from '../domain/return-request.entity.js';

export class PgReturnRequestRepository implements ReturnRequestRepository {
  async findById(id: string): Promise<ReturnRequest | null> {
    const rows = await db.select().from(returnRequests).where(eq(returnRequests.id, id)).limit(1);
    if (!rows.length) return null;
    return this.toEntity(rows[0]);
  }

  async findByOrderItemId(orderItemId: string): Promise<ReturnRequest | null> {
    const rows = await db
      .select()
      .from(returnRequests)
      .where(eq(returnRequests.orderItemId, orderItemId))
      .limit(1);
    if (!rows.length) return null;
    return this.toEntity(rows[0]);
  }

  async create(request: ReturnRequest): Promise<void> {
    await db.insert(returnRequests).values({
      id: request.id,
      orderId: request.orderId,
      orderItemId: request.orderItemId,
      reason: request.reason,
      status: request.status,
      evidence: request.evidence as any,
      requestedAt: request.requestedAt,
      processedAt: request.processedAt,
      metadata: request.metadata as any,
    });
  }

  async updateStatus(id: string, status: string, processedAt: Date): Promise<void> {
    await db.update(returnRequests).set({ status, processedAt }).where(eq(returnRequests.id, id));
  }

  async findAll(options?: FindReturnRequestsOptions): Promise<ReturnRequest[]> {
    if (options?.userId) {
      return this.findAllByUserId(options);
    }

    const conditions: any[] = [];
    if (options?.status) conditions.push(eq(returnRequests.status, options.status));
    if (options?.orderId) conditions.push(eq(returnRequests.orderId, options.orderId));

    let query: any = db.select().from(returnRequests);
    if (conditions.length > 0) query = query.where(and(...conditions));
    if (options?.limit !== undefined) query = query.limit(options.limit);
    if (options?.offset !== undefined) query = query.offset(options.offset);

    const rows = await query;
    return rows.map((r: any) => this.toEntity(r));
  }

  async count(options?: Pick<FindReturnRequestsOptions, 'userId' | 'status'>): Promise<number> {
    if (options?.userId) {
      const rows = await this.findAllByUserId({ userId: options.userId, status: options.status });
      return rows.length;
    }

    const conditions: any[] = [];
    if (options?.status) conditions.push(eq(returnRequests.status, options.status));

    let query: any = db.select().from(returnRequests);
    if (conditions.length > 0) query = query.where(and(...conditions));

    const rows = await query;
    return rows.length;
  }

  private async findAllByUserId(options: FindReturnRequestsOptions): Promise<ReturnRequest[]> {
    const userOrders = await db
      .select({ id: orders.id })
      .from(orders)
      .where(eq(orders.userId, options.userId!));

    if (!userOrders.length) return [];

    const orderIds = userOrders.map((o) => o.id);

    let query: any = db.select().from(returnRequests);

    if (orderIds.length === 1) {
      let cond: any = eq(returnRequests.orderId, orderIds[0]);
      if (options?.status) {
        cond = and(cond, eq(returnRequests.status, options.status));
      }
      query = query.where(cond);
    } else {
      // Use manual OR for multiple orderIds
      const { or } = await import('drizzle-orm');
      let orderCondition: any = or(...orderIds.map((oid) => eq(returnRequests.orderId, oid)));
      if (options?.status) {
        orderCondition = and(orderCondition, eq(returnRequests.status, options.status));
      }
      query = query.where(orderCondition);
    }

    if (options?.limit !== undefined) query = query.limit(options.limit);
    if (options?.offset !== undefined) query = query.offset(options.offset);

    const rows = await query;
    return rows.map((r: any) => this.toEntity(r));
  }

  private toEntity(r: any): ReturnRequest {
    return ReturnRequest.create({
      id: r.id,
      orderId: r.orderId,
      orderItemId: r.orderItemId,
      reason: r.reason,
      status: r.status,
      evidence: r.evidence,
      requestedAt: r.requestedAt,
      processedAt: r.processedAt,
      metadata: r.metadata,
    });
  }
}
