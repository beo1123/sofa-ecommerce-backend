import { randomUUID } from 'crypto';
import { AddressRepository } from '../domain/address.repository.js';
import { Address } from '../domain/address.entity.js';

export interface CreateAddressInput {
  userId: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  province?: string;
  postalCode?: string;
  country: string;
  phone?: string;
  metadata?: Record<string, unknown>;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}

export interface CreateAddressOutput {
  id: string;
  userId: string | null;
  fullName: string;
  line1: string;
  line2: string | null;
  city: string;
  province: string | null;
  postalCode: string | null;
  country: string;
  phone: string | null;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

export class CreateAddressUseCase {
  constructor(private readonly repo: AddressRepository) {}

  async execute(input: CreateAddressInput): Promise<CreateAddressOutput> {
    if (input.isDefaultShipping) {
      await this.repo.clearDefaultShipping(input.userId);
    }
    if (input.isDefaultBilling) {
      await this.repo.clearDefaultBilling(input.userId);
    }

    const address = Address.create({
      id: randomUUID(),
      userId: input.userId,
      fullName: input.fullName,
      line1: input.line1,
      line2: input.line2 ?? null,
      city: input.city,
      province: input.province ?? null,
      postalCode: input.postalCode ?? null,
      country: input.country,
      phone: input.phone ?? null,
      metadata: input.metadata ?? null,
      isDefaultShipping: input.isDefaultShipping ?? false,
      isDefaultBilling: input.isDefaultBilling ?? false,
    });

    await this.repo.create(address);

    return {
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
      isDefaultShipping: address.isDefaultShipping,
      isDefaultBilling: address.isDefaultBilling,
    };
  }
}
