import jwt from 'jsonwebtoken';

export interface JwtPayload {
  sub: string; // User ID
  email: string;
  role?: string;
}

export class JwtService {
  constructor(
    private readonly accessSecret: string,
    private readonly refreshSecret: string,
  ) {
    if (!accessSecret || !refreshSecret) {
      throw new Error('JWT Secrets are missing in .env');
    }
  }

  signAccess(payload: JwtPayload): string {
    return jwt.sign(payload, this.accessSecret, { expiresIn: '15m' });
  }

  signRefresh(payload: JwtPayload): string {
    return jwt.sign(payload, this.refreshSecret, { expiresIn: '7d' });
  }

  verifyAccess(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.accessSecret) as JwtPayload;
    } catch {
      throw new Error('Invalid or expired access token');
    }
  }

  verifyRefresh(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.refreshSecret) as JwtPayload;
    } catch {
      throw new Error('Invalid or expired refresh token');
    }
  }
}
