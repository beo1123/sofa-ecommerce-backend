import bcrypt from 'bcrypt';
import { UserRepository } from '../domain/user.repository.js';
import { JwtService } from '../../../shared/auth/jwt.service.js';
import { InvalidCredentialsError } from './errors.js';

export class LoginUseCase {
  constructor(
    private readonly repo: UserRepository,
    private readonly jwt: JwtService,
  ) {}

  async execute(input: { email: string; password: string }) {
    const user = await this.repo.findByEmail(input.email);
    if (!user || !user.passwordHash) throw new InvalidCredentialsError();

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) throw new InvalidCredentialsError();
    const payload = { sub: user.id, email: user.email };

    return {
      user: { id: user.id, email: user.email },
      accessToken: this.jwt.signAccess(payload),
      refreshToken: this.jwt.signRefresh(payload),
    };
  }
}
