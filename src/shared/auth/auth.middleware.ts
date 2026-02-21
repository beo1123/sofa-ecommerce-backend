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

/**
 * Role-based access control middleware
 * Checks if user has required role(s)
 */
export function requireRole(...roles: string[]) {
  return async (
    req: Request & { user?: any; userRoles?: string[] },
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      return res.status(401).json(fail('UNAUTHORIZED', 'Login required'));
    }

    // Get user roles from request (should be set by enrichUserRoles middleware)
    const userRoles = req.userRoles || [];

    // Normalize roles to lowercase for case-insensitive comparison
    const userRolesLower = userRoles.map((r) => r.toLowerCase());
    const requiredRolesLower = roles.map((r) => r.toLowerCase());

    // Check if user has at least one of the required roles
    const hasRequiredRole = requiredRolesLower.some((role) => userRolesLower.includes(role));

    if (!hasRequiredRole) {
      return res
        .status(403)
        .json(fail('FORBIDDEN', `Requires one of these roles: ${roles.join(', ')}`));
    }

    next();
  };
}
