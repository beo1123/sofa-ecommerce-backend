import { UserRepository } from '../domain/user.repository.js';
import { NotFoundError } from '../../../shared/errors/not-found.error.js';

export class GetUserRolesUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: string): Promise<string[]> {
    // Verify user exists
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError(`User with id "${userId}" not found`);
    }

    return await this.userRepo.getUserRoles(userId);
  }
}
