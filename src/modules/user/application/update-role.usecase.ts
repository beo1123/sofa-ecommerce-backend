import { RoleRepository } from '../domain/role.repository.js';
import { Role } from '../domain/role.entity.js';
import { NotFoundError } from '../../../shared/errors/not-found.error.js';
import { ConflictError } from '../../../shared/errors/conflict.error.js';

export class UpdateRoleUseCase {
  constructor(private readonly roleRepo: RoleRepository) {}

  async execute(input: { id: string; name: string }): Promise<{ id: string; name: string }> {
    // Check if role exists
    const existing = await this.roleRepo.findById(input.id);
    if (!existing) {
      throw new NotFoundError(`Role with id "${input.id}" not found`);
    }

    // Check if new name is already taken by another role
    if (existing.name !== input.name) {
      const roleWithNewName = await this.roleRepo.findByName(input.name);
      if (roleWithNewName) {
        throw new ConflictError(`Role "${input.name}" already exists`);
      }
    }

    const role = Role.create({
      id: input.id,
      name: input.name,
    });

    await this.roleRepo.update(role);

    return {
      id: role.id,
      name: role.name,
    };
  }
}
