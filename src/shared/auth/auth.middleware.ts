/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import { fail } from '../http/api-response.js';
import { JwtService } from './jwt.service.js';

const jwt = new JwtService(process.env.JWT_ACCESS_SECRET!, process.env.JWT_REFRESH_SECRET!);

export function requireAuth(req: Request & { user?: any }, res: Response, next: NextFunction) {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) {
    return res.status(401).json(fail('UNAUTHORIZED', 'Login required'));
  }

  try {
    const token = h.slice(7);
    const payload = jwt.verifyAccess(token);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json(fail('UNAUTHORIZED', 'Invalid token'));
  }
}
