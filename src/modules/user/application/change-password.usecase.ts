import bcrypt from 'bcrypt';
import { UserRepository } from '../domain/user.repository.js';
import { NotFoundError } from '../../../shared/errors/not-found.error.js';
import { InvalidCredentialsError } from './errors.js';

export class ChangePasswordUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(userId: string, input: { oldPassword: string; newPassword: string }) {
    const user = await this.repo.findById(userId);
    if (!user || !user.passwordHash) {
      throw new NotFoundError('User not found');
    }

    const ok = await bcrypt.compare(input.oldPassword, user.passwordHash);
    if (!ok) {
      throw new InvalidCredentialsError();
    }

    const newHash = await bcrypt.hash(input.newPassword, 10);
    await this.repo.updatePassword(userId, newHash);
  }
}
