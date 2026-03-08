import { AddressRepository } from '../domain/address.repository.js';
import { AddressNotFoundError, AddressAccessDeniedError } from './errors.js';

export interface UpdateAddressInput {
  id: string;
  userId: string;
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
}

export interface UpdateAddressOutput {
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

export class UpdateAddressUseCase {
  constructor(private readonly repo: AddressRepository) {}

  async execute(input: UpdateAddressInput): Promise<UpdateAddressOutput> {
    const address = await this.repo.findById(input.id);
    if (!address) {
      throw new AddressNotFoundError();
    }

    if (address.userId !== input.userId) {
      throw new AddressAccessDeniedError();
    }

    if (input.isDefaultShipping) {
      await this.repo.clearDefaultShipping(input.userId);
    }
    if (input.isDefaultBilling) {
      await this.repo.clearDefaultBilling(input.userId);
    }

    const updateData: {
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
    } = {};

    if (input.fullName !== undefined) updateData.fullName = input.fullName;
    if (input.line1 !== undefined) updateData.line1 = input.line1;
    if (input.line2 !== undefined) updateData.line2 = input.line2;
    if (input.city !== undefined) updateData.city = input.city;
    if (input.province !== undefined) updateData.province = input.province;
    if (input.postalCode !== undefined) updateData.postalCode = input.postalCode;
    if (input.country !== undefined) updateData.country = input.country;
    if (input.phone !== undefined) updateData.phone = input.phone;
    if (input.metadata !== undefined) updateData.metadata = input.metadata;
    if (input.isDefaultShipping !== undefined)
      updateData.isDefaultShipping = input.isDefaultShipping;
    if (input.isDefaultBilling !== undefined) updateData.isDefaultBilling = input.isDefaultBilling;

    await this.repo.update(input.id, updateData);

    const updated = await this.repo.findById(input.id);
    if (!updated) {
      throw new AddressNotFoundError();
    }

    return {
      id: updated.id,
      userId: updated.userId,
      fullName: updated.fullName,
      line1: updated.line1,
      line2: updated.line2,
      city: updated.city,
      province: updated.province,
      postalCode: updated.postalCode,
      country: updated.country,
      phone: updated.phone,
      isDefaultShipping: updated.isDefaultShipping,
      isDefaultBilling: updated.isDefaultBilling,
    };
  }
}
