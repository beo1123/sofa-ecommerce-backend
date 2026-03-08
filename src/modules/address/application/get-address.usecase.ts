import { AddressRepository } from '../domain/address.repository.js';
import { Address } from '../domain/address.entity.js';
import { AddressNotFoundError, AddressAccessDeniedError } from './errors.js';

export class GetAddressUseCase {
  constructor(private readonly repo: AddressRepository) {}

  async execute(id: string, userId: string): Promise<Address> {
    const address = await this.repo.findById(id);
    if (!address) {
      throw new AddressNotFoundError();
    }

    if (address.userId !== userId) {
      throw new AddressAccessDeniedError();
    }

    return address;
  }
}
