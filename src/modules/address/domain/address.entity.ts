import { randomUUID } from 'crypto';

export class Address {
  constructor(
    public readonly id: string,
    public readonly userId: string | null,
    public readonly fullName: string,
    public readonly line1: string,
    public readonly line2: string | null,
    public readonly city: string,
    public readonly province: string | null,
    public readonly postalCode: string | null,
    public readonly country: string,
    public readonly phone: string | null,
    public readonly metadata: Record<string, unknown> | null,
    public readonly isDefaultShipping: boolean,
    public readonly isDefaultBilling: boolean,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(data: {
    id?: string;
    userId?: string | null;
    fullName: string;
    line1: string;
    line2?: string | null;
    city: string;
    province?: string | null;
    postalCode?: string | null;
    country: string;
    phone?: string | null;
    metadata?: Record<string, unknown> | null;
    isDefaultShipping?: boolean;
    isDefaultBilling?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }): Address {
    return new Address(
      data.id ?? randomUUID(),
      data.userId ?? null,
      data.fullName,
      data.line1,
      data.line2 ?? null,
      data.city,
      data.province ?? null,
      data.postalCode ?? null,
      data.country,
      data.phone ?? null,
      data.metadata ?? null,
      data.isDefaultShipping ?? false,
      data.isDefaultBilling ?? false,
      data.createdAt,
      data.updatedAt,
    );
  }
}
