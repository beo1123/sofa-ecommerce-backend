import { randomUUID } from 'crypto';
import { OrderRepository } from '../domain/order.repository.js';
import { Order, OrderItem } from '../domain/order.entity.js';

export interface CreateOrderItemInput {
  productId?: string;
  variantId?: string;
  sku?: string;
  name: string;
  price: string;
  quantity: number;
  total: string;
}

export interface CreateOrderInput {
  userId: string;
  shippingAddressId?: string;
  billingAddressId?: string;
  recipientName: string;
  phone: string;
  email?: string;
  line1: string;
  city?: string;
  province: string;
  country?: string;
  paymentMethod: string;
  couponId?: string;
  shipping?: string;
  tax?: string;
  items: CreateOrderItemInput[];
}

export interface CreateOrderOutput {
  id: string;
  orderNumber: string;
  userId: string | null;
  status: string;
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  paymentMethod: string;
  items: {
    id: string;
    name: string;
    price: string;
    quantity: number;
    total: string;
  }[];
  createdAt?: Date;
}

export class CreateOrderUseCase {
  constructor(private readonly repo: OrderRepository) {}

  async execute(input: CreateOrderInput): Promise<CreateOrderOutput> {
    const orderId = randomUUID();

    const subtotal = input.items.reduce((sum, item) => sum + parseFloat(item.total), 0).toFixed(2);

    const shipping = input.shipping ?? '0';
    const tax = input.tax ?? '0';
    const total = (parseFloat(subtotal) + parseFloat(shipping) + parseFloat(tax)).toFixed(2);

    const orderItems = input.items.map((item) =>
      OrderItem.create({
        id: randomUUID(),
        orderId,
        productId: item.productId ?? null,
        variantId: item.variantId ?? null,
        sku: item.sku ?? null,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.total,
      }),
    );

    const order = Order.create({
      id: orderId,
      userId: input.userId,
      shippingAddressId: input.shippingAddressId ?? null,
      billingAddressId: input.billingAddressId ?? null,
      recipientName: input.recipientName,
      phone: input.phone,
      email: input.email ?? null,
      line1: input.line1,
      city: input.city,
      province: input.province,
      country: input.country,
      status: 'CREATED',
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod: input.paymentMethod,
      couponId: input.couponId ?? null,
      items: orderItems,
    });

    await this.repo.create(order);

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      status: order.status,
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
      paymentMethod: order.paymentMethod,
      items: orderItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.total,
      })),
      createdAt: order.createdAt,
    };
  }
}
