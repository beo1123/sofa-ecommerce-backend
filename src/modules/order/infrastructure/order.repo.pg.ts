/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq, desc } from 'drizzle-orm';
import { db } from '../../../shared/db/pg.js';
import { orders, orderItems } from '../../../shared/db/schema.js';
import { OrderRepository, FindAllOptions } from '../domain/order.repository.js';
import { Order, OrderItem } from '../domain/order.entity.js';

export class PgOrderRepository implements OrderRepository {
  async findById(id: string): Promise<Order | null> {
    const rows = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (!rows.length) return null;

    const itemRows = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
    const items = itemRows.map((i) => this.toItemEntity(i));

    return this.toEntity(rows[0], items);
  }

  async findByUserId(userId: string, limit?: number, offset?: number): Promise<Order[]> {
    let query: any = db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));

    if (limit !== undefined) query = query.limit(limit);
    if (offset !== undefined) query = query.offset(offset);

    const rows = await query;
    return rows.map((r: any) => this.toEntity(r, []));
  }

  async findAll(options?: FindAllOptions): Promise<Order[]> {
    let query: any = db.select().from(orders);

    if (options?.status) {
      query = query.where(eq(orders.status, options.status));
    }

    query = query.orderBy(desc(orders.createdAt));

    if (options?.limit !== undefined) query = query.limit(options.limit);
    if (options?.offset !== undefined) query = query.offset(options.offset);

    const rows = await query;
    return rows.map((r: any) => this.toEntity(r, []));
  }

  async create(order: Order): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.insert(orders).values({
        id: order.id,
        orderNumber: order.orderNumber,
        userId: order.userId,
        shippingAddressId: order.shippingAddressId,
        billingAddressId: order.billingAddressId,
        recipientName: order.recipientName,
        phone: order.phone,
        email: order.email,
        line1: order.line1,
        city: order.city,
        province: order.province,
        country: order.country,
        status: order.status,
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        paymentMethod: order.paymentMethod,
        couponId: order.couponId,
      });

      if (order.items && order.items.length > 0) {
        await tx.insert(orderItems).values(
          order.items.map((item) => ({
            id: item.id,
            orderId: item.orderId,
            productId: item.productId,
            variantId: item.variantId,
            sku: item.sku,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: item.total,
            returned: item.returned,
          })),
        );
      }
    });
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, id));
  }

  private toEntity(r: any, items: OrderItem[]): Order {
    return Order.create({
      id: r.id,
      orderNumber: r.orderNumber,
      userId: r.userId,
      shippingAddressId: r.shippingAddressId,
      billingAddressId: r.billingAddressId,
      recipientName: r.recipientName,
      phone: r.phone,
      email: r.email,
      line1: r.line1,
      city: r.city,
      province: r.province,
      country: r.country,
      status: r.status,
      subtotal: r.subtotal,
      shipping: r.shipping,
      tax: r.tax,
      total: r.total,
      paymentMethod: r.paymentMethod,
      couponId: r.couponId,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      items,
    });
  }

  private toItemEntity(i: any): OrderItem {
    return OrderItem.create({
      id: i.id,
      orderId: i.orderId,
      productId: i.productId,
      variantId: i.variantId,
      sku: i.sku,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      total: i.total,
      returned: i.returned,
      createdAt: i.createdAt,
    });
  }
}
