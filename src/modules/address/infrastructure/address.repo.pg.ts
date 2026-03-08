/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq, and } from 'drizzle-orm';
import { db } from '../../../shared/db/pg.js';
import { addresses } from '../../../shared/db/schema.js';
import { AddressRepository } from '../domain/address.repository.js';
import { Address } from '../domain/address.entity.js';

export class PgAddressRepository implements AddressRepository {
  async findById(id: string): Promise<Address | null> {
    const rows = await db.select().from(addresses).where(eq(addresses.id, id)).limit(1);
    if (!rows.length) return null;
    return this.toEntity(rows[0]);
  }

  async findByUserId(userId: string): Promise<Address[]> {
    const rows = await db.select().from(addresses).where(eq(addresses.userId, userId));
    return rows.map((r) => this.toEntity(r));
  }

  async create(address: Address): Promise<void> {
    await db.insert(addresses).values({
      id: address.id,
      userId: address.userId,
      fullName: address.fullName,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
      metadata: address.metadata as any,
      isDefaultShipping: address.isDefaultShipping,
      isDefaultBilling: address.isDefaultBilling,
    });
  }

  async update(
    id: string,
    data: {
      fullName?: string;
      line1?: string;
      line2?: string | null;
      city?: string;
      province?: string | null;
      postalCode?: string | null;
      country?: string;
      phone?: string | null;
      metadata?: Record<string, unknown> | null;
      isDefaultShipping?: boolean;
      isDefaultBilling?: boolean;
    },
  ): Promise<void> {
    const updateData: any = { updatedAt: new Date() };

    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.line1 !== undefined) updateData.line1 = data.line1;
    if (data.line2 !== undefined) updateData.line2 = data.line2;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.province !== undefined) updateData.province = data.province;
    if (data.postalCode !== undefined) updateData.postalCode = data.postalCode;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.metadata !== undefined) updateData.metadata = data.metadata;
    if (data.isDefaultShipping !== undefined) updateData.isDefaultShipping = data.isDefaultShipping;
    if (data.isDefaultBilling !== undefined) updateData.isDefaultBilling = data.isDefaultBilling;

    await db.update(addresses).set(updateData).where(eq(addresses.id, id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(addresses).where(eq(addresses.id, id));
  }

  async clearDefaultShipping(userId: string): Promise<void> {
    await db
      .update(addresses)
      .set({ isDefaultShipping: false, updatedAt: new Date() })
      .where(and(eq(addresses.userId, userId), eq(addresses.isDefaultShipping, true)));
  }

  async clearDefaultBilling(userId: string): Promise<void> {
    await db
      .update(addresses)
      .set({ isDefaultBilling: false, updatedAt: new Date() })
      .where(and(eq(addresses.userId, userId), eq(addresses.isDefaultBilling, true)));
  }

  private toEntity(r: any): Address {
    return Address.create({
      id: r.id,
      userId: r.userId,
      fullName: r.fullName,
      line1: r.line1,
      line2: r.line2,
      city: r.city,
      province: r.province,
      postalCode: r.postalCode,
      country: r.country,
      phone: r.phone,
      metadata: r.metadata as Record<string, unknown> | null,
      isDefaultShipping: r.isDefaultShipping,
      isDefaultBilling: r.isDefaultBilling,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    });
  }
}
