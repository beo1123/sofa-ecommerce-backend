import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { UserRepository } from '../domain/user.repository.js';
import { JwtService } from '../../../shared/auth/jwt.service.js';
import { EmailAlreadyExistsError } from './errors.js';
import { User } from '../domain/user.entity.js';

export class RegisterUserUseCase {
  constructor(
    private readonly repo: UserRepository,
    private readonly jwt: JwtService,
  ) {}

  async execute(input: {
    email: string;
    password: string;
    username?: string;
    displayName?: string;
  }) {
    const existed = await this.repo.findByEmail(input.email);
    if (existed) throw new EmailAlreadyExistsError();

    const hash = await bcrypt.hash(input.password, 10);
    const user = new User(randomUUID(), input.email, hash, input.displayName, input.username);

    await this.repo.create(user);

    const payload = { sub: user.id, email: user.email };

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
      },
      accessToken: this.jwt.signAccess(payload),
      refreshToken: this.jwt.signRefresh(payload),
    };
  }
}
