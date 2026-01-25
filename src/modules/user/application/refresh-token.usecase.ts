import { JwtService } from '../../../shared/auth/jwt.service.js';

export class RefreshTokenUseCase {
  constructor(private readonly jwt: JwtService) {}

  async execute(refreshToken: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = this.jwt.verifyRefresh(refreshToken) as any;

    return {
      accessToken: this.jwt.signAccess({
        sub: payload.sub,
        email: payload.email,
      }),
    };
  }
}
