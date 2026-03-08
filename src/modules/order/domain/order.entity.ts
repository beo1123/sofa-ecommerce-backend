import { randomUUID } from 'crypto';

export class OrderItem {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly productId: string | null,
    public readonly variantId: string | null,
    public readonly sku: string | null,
    public readonly name: string,
    public readonly price: string,
    public readonly quantity: number,
    public readonly total: string,
    public readonly returned: boolean,
    public readonly createdAt?: Date,
  ) {}

  static create(data: {
    id?: string;
    orderId: string;
    productId?: string | null;
    variantId?: string | null;
    sku?: string | null;
    name: string;
    price: string;
    quantity: number;
    total: string;
    returned?: boolean;
    createdAt?: Date;
  }): OrderItem {
    return new OrderItem(
      data.id ?? randomUUID(),
      data.orderId,
      data.productId ?? null,
      data.variantId ?? null,
      data.sku ?? null,
      data.name,
      data.price,
      data.quantity,
      data.total,
      data.returned ?? false,
      data.createdAt,
    );
  }
}

export class Order {
  constructor(
    public readonly id: string,
    public readonly orderNumber: string,
    public readonly userId: string | null,
    public readonly shippingAddressId: string | null,
    public readonly billingAddressId: string | null,
    public readonly recipientName: string,
    public readonly phone: string,
    public readonly email: string | null,
    public readonly line1: string,
    public readonly city: string,
    public readonly province: string,
    public readonly country: string,
    public readonly status: string,
    public readonly subtotal: string,
    public readonly shipping: string,
    public readonly tax: string,
    public readonly total: string,
    public readonly paymentMethod: string,
    public readonly couponId: string | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly items?: OrderItem[],
  ) {}

  static create(data: {
    id?: string;
    orderNumber?: string;
    userId?: string | null;
    shippingAddressId?: string | null;
    billingAddressId?: string | null;
    recipientName: string;
    phone: string;
    email?: string | null;
    line1: string;
    city?: string;
    province: string;
    country?: string;
    status?: string;
    subtotal: string;
    shipping?: string;
    tax?: string;
    total: string;
    paymentMethod: string;
    couponId?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    items?: OrderItem[];
  }): Order {
    return new Order(
      data.id ?? randomUUID(),
      data.orderNumber ?? `ORD-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`,
      data.userId ?? null,
      data.shippingAddressId ?? null,
      data.billingAddressId ?? null,
      data.recipientName,
      data.phone,
      data.email ?? null,
      data.line1,
      data.city ?? 'TPHCM',
      data.province,
      data.country ?? 'Việt Nam',
      data.status ?? 'CREATED',
      data.subtotal,
      data.shipping ?? '0',
      data.tax ?? '0',
      data.total,
      data.paymentMethod,
      data.couponId ?? null,
      data.createdAt,
      data.updatedAt,
      data.items,
    );
  }
}
