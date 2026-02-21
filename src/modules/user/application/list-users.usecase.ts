import { UserRepository } from '../domain/user.repository.js';

export class ListUsersUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(): Promise<
    Array<{
      id: string;
      email: string;
      displayName?: string | null;
      username?: string | null;
      roles: string[];
    }>
  > {
    const users = await this.userRepo.findAll();
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      username: user.username,
      roles: user.roles,
    }));
  }
}
