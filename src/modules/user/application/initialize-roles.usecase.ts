import { RoleRepository } from '../domain/role.repository.js';
import { Role } from '../domain/role.entity.js';
import { v4 as uuid } from 'uuid';

/**
 * Initialize system with default roles
 * Should be called once during application setup
 */
export class InitializeRolesUseCase {
  private readonly DEFAULT_ROLES = ['admin', 'moderator', 'user'];

  constructor(private readonly roleRepo: RoleRepository) {}

  async execute(): Promise<{ created: string[]; skipped: string[] }> {
    const created: string[] = [];
    const skipped: string[] = [];

    for (const roleName of this.DEFAULT_ROLES) {
      const existing = await this.roleRepo.findByName(roleName);
      if (existing) {
        skipped.push(roleName);
      } else {
        const role = Role.create({
          id: uuid(),
          name: roleName,
        });
        await this.roleRepo.create(role);
        created.push(roleName);
      }
    }

    return { created, skipped };
  }
}
