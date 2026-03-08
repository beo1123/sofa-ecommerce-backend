import { Router } from 'express';
import { requireAuth, requireRole } from '../../../shared/auth/auth.middleware.js';
import { enrichUserRoles } from '../../../shared/auth/role.middleware.js';
import { PgOrderRepository } from '../infrastructure/order.repo.pg.js';
import { CreateOrderUseCase } from '../application/create-order.usecase.js';
import { GetOrderUseCase } from '../application/get-order.usecase.js';
import { ListOrdersUseCase } from '../application/list-orders.usecase.js';
import { UpdateOrderStatusUseCase } from '../application/update-order-status.usecase.js';
import { CancelOrderUseCase } from '../application/cancel-order.usecase.js';
import { OrderController } from './order.controller.js';

export function createOrderRouter(): Router {
  const repo = new PgOrderRepository();

  const createUC = new CreateOrderUseCase(repo);
  const getUC = new GetOrderUseCase(repo);
  const listUC = new ListOrdersUseCase(repo);
  const updateStatusUC = new UpdateOrderStatusUseCase(repo);
  const cancelUC = new CancelOrderUseCase(repo);

  const controller = new OrderController(createUC, getUC, listUC, updateStatusUC, cancelUC);

  const r = Router();

  r.get('/', requireAuth, enrichUserRoles, controller.handle(controller.list));
  r.get('/:id', requireAuth, enrichUserRoles, controller.handle(controller.getById));
  r.post('/', requireAuth, controller.handle(controller.create));
  r.patch(
    '/:id/status',
    requireAuth,
    enrichUserRoles,
    requireRole('admin'),
    controller.handle(controller.updateStatus),
  );
  r.post('/:id/cancel', requireAuth, enrichUserRoles, controller.handle(controller.cancel));

  return r;
}
