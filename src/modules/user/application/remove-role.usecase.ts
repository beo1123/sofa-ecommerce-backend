import { UserRepository } from '../domain/user.repository.js';
import { RoleRepository } from '../domain/role.repository.js';
import { NotFoundError } from '../../../shared/errors/not-found.error.js';

export class RemoveRoleUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly roleRepo: RoleRepository,
  ) {}

  async execute(input: { userId: string; roleName: string }): Promise<void> {
    // Verify user exists
    const user = await this.userRepo.findById(input.userId);
    if (!user) {
      throw new NotFoundError(`User with id "${input.userId}" not found`);
    }

    // Find role by name
    const role = await this.roleRepo.findByName(input.roleName);
    if (!role) {
      throw new NotFoundError(`Role "${input.roleName}" not found`);
    }

    // Remove role
    await this.userRepo.removeRole(input.userId, role.id);
  }
}
