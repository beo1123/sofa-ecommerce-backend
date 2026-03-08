import { AddressRepository } from '../domain/address.repository.js';
import { AddressNotFoundError, AddressAccessDeniedError } from './errors.js';

export class DeleteAddressUseCase {
  constructor(private readonly repo: AddressRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const address = await this.repo.findById(id);
    if (!address) {
      throw new AddressNotFoundError();
    }

    if (address.userId !== userId) {
      throw new AddressAccessDeniedError();
    }

    await this.repo.delete(id);
  }
}
