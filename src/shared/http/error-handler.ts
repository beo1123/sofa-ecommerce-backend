import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { fail } from './api-response.js';
import { DomainError } from '../errors/domain.error.js';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json(fail('VALIDATION_ERROR', 'Invalid request', err.flatten()));
  }

  if (err instanceof DomainError) {
    return res.status(err.status).json(fail(err.code, err.message));
  }

  console.error(err);
  return res.status(500).json(fail('INTERNAL_ERROR', 'Internal server error'));
}
