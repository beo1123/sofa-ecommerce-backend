import { Address } from './address.entity.js';

export interface AddressRepository {
  findById(id: string): Promise<Address | null>;
  findByUserId(userId: string): Promise<Address[]>;
  create(address: Address): Promise<void>;
  update(
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
  ): Promise<void>;
  delete(id: string): Promise<void>;
  clearDefaultShipping(userId: string): Promise<void>;
  clearDefaultBilling(userId: string): Promise<void>;
}
