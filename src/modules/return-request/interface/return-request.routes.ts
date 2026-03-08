import { Router } from 'express';
import { requireAuth, requireRole } from '../../../shared/auth/auth.middleware.js';
import { enrichUserRoles } from '../../../shared/auth/role.middleware.js';
import { PgReturnRequestRepository } from '../infrastructure/return-request.repo.pg.js';
import { CreateReturnRequestUseCase } from '../application/create-return-request.usecase.js';
import { GetReturnRequestUseCase } from '../application/get-return-request.usecase.js';
import { ListReturnRequestsUseCase } from '../application/list-return-requests.usecase.js';
import { ProcessReturnRequestUseCase } from '../application/process-return-request.usecase.js';
import { ReturnRequestController } from './return-request.controller.js';

export function createReturnRequestRouter(): Router {
  const repo = new PgReturnRequestRepository();

  const createUC = new CreateReturnRequestUseCase(repo);
  const getUC = new GetReturnRequestUseCase(repo);
  const listUC = new ListReturnRequestsUseCase(repo);
  const processUC = new ProcessReturnRequestUseCase(repo);

  const controller = new ReturnRequestController(createUC, getUC, listUC, processUC);

  const r = Router();

  r.get('/', requireAuth, enrichUserRoles, controller.handle(controller.list));
  r.get('/:id', requireAuth, enrichUserRoles, controller.handle(controller.getById));
  r.post('/', requireAuth, controller.handle(controller.create));
  r.patch(
    '/:id/process',
    requireAuth,
    enrichUserRoles,
    requireRole('admin'),
    controller.handle(controller.process),
  );

  return r;
}
