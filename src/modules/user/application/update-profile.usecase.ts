import { NotFoundError } from '../../../shared/errors/not-found.error.js';
import { UserRepository } from '../domain/user.repository.js';

export class UpdateProfileUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(userId: string, data: { username?: string; displayName?: string }) {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await this.repo.updateProfile(userId, data);
  }
}
