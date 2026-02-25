import { RoleRepository } from '../domain/role.repository.js';
import { NotFoundError } from '../../../shared/errors/not-found.error.js';

export class DeleteRoleUseCase {
  constructor(private readonly roleRepo: RoleRepository) {}

  async execute(id: string): Promise<void> {
    // Check if role exists
    const existing = await this.roleRepo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Role with id "${id}" not found`);
    }

    await this.roleRepo.delete(id);
  }
}
