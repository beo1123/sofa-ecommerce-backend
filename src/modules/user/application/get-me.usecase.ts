import { NotFoundError } from '../../../shared/errors/not-found.error.js';
import { UserRepository } from '../domain/user.repository.js';

export class GetMeUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(userId: string) {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
    };
  }
}
