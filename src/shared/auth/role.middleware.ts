/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import { PgUserRepository } from '../../modules/user/infrastructure/user.repo.pg.js';

const userRepo = new PgUserRepository();

/**
 * Middleware to enrich request with user roles
 * Should be used after requireAuth middleware
 */
export async function enrichUserRoles(
  req: Request & { user?: any; userRoles?: string[] },
  res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return next();
  }

  try {
    const userRoles = await userRepo.getUserRoles(req.user.sub);
    req.userRoles = userRoles;
    next();
  } catch (error) {
    console.error('Error enriching user roles:', error);
    // Continue anyway, userRoles will be empty
    req.userRoles = [];
    next();
  }
}
