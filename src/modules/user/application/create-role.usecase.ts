import { RoleRepository } from '../domain/role.repository.js';
import { Role } from '../domain/role.entity.js';
import { ConflictError } from '../../../shared/errors/conflict.error.js';
import { v4 as uuid } from 'uuid';

export class CreateRoleUseCase {
  constructor(private readonly roleRepo: RoleRepository) {}

  async execute(input: { name: string }): Promise<{ id: string; name: string }> {
    // Check if role already exists
    const existing = await this.roleRepo.findByName(input.name);
    if (existing) {
      throw new ConflictError(`Role "${input.name}" already exists`);
    }

    const role = Role.create({
      id: uuid(),
      name: input.name,
    });

    await this.roleRepo.create(role);

    return {
      id: role.id,
      name: role.name,
    };
  }
}
