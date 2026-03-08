import { AddressRepository } from '../domain/address.repository.js';
import { AddressNotFoundError, AddressAccessDeniedError } from './errors.js';

export interface SetDefaultAddressInput {
  id: string;
  userId: string;
  type: 'shipping' | 'billing';
}

export class SetDefaultAddressUseCase {
  constructor(private readonly repo: AddressRepository) {}

  async execute(input: SetDefaultAddressInput): Promise<void> {
    const address = await this.repo.findById(input.id);
    if (!address) {
      throw new AddressNotFoundError();
    }

    if (address.userId !== input.userId) {
      throw new AddressAccessDeniedError();
    }

    if (input.type === 'shipping') {
      await this.repo.clearDefaultShipping(input.userId);
      await this.repo.update(input.id, { isDefaultShipping: true });
    } else {
      await this.repo.clearDefaultBilling(input.userId);
      await this.repo.update(input.id, { isDefaultBilling: true });
    }
  }
}
