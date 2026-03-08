import { AddressRepository } from '../domain/address.repository.js';
import { Address } from '../domain/address.entity.js';

export class ListAddressesUseCase {
  constructor(private readonly repo: AddressRepository) {}

  async execute(userId: string): Promise<Address[]> {
    return this.repo.findByUserId(userId);
  }
}
