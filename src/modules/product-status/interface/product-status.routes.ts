/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
import { PgProductRepository } from '../../product/infrastructure/product.repo.pg.js';
import { ListProductStatusesUseCase } from '../application/list-product-statuses.usecase.js';
import { CreateProductStatusUseCase } from '../application/create-product-status.usecase.js';
import { DeleteProductStatusUseCase } from '../application/delete-product-status.usecase.js';
import { requireAuth } from '../../../shared/auth/auth.middleware.js';
import { enrichUserRoles } from '../../../shared/auth/role.middleware.js';
import { requireRole } from '../../../shared/auth/auth.middleware.js';
import { BaseController } from '../../../shared/http/base-controller.js';
import { z } from 'zod';
import { ok } from '../../../shared/http/api-response.js';

class ProductStatusController extends BaseController {
  constructor(
    private readonly listUC: ListProductStatusesUseCase,
    private readonly createUC: CreateProductStatusUseCase,
    private readonly deleteUC: DeleteProductStatusUseCase,
  ) {
    super();
  }

  list = async (_req: any, res: any) => {
    const items = await this.listUC.execute();
    res.json(ok(items));
  };

  create = async (req: any, res: any) => {
    const schema = z.object({ name: z.string().min(1), description: z.string().optional() });
    const { name, description } = schema.parse(req.body);
    await this.createUC.execute(name, description);
    res.status(201).json(ok({ name }));
  };

  delete = async (req: any, res: any) => {
    const schema = z.object({ name: z.string().min(1) });
    const { name } = schema.parse(req.params);
    await this.deleteUC.execute(name);
    res.json(ok({}));
  };
}

export function createProductStatusRouter(): Router {
  const repo = new PgProductRepository();
  const controller = new ProductStatusController(
    new ListProductStatusesUseCase(repo),
    new CreateProductStatusUseCase(repo),
    new DeleteProductStatusUseCase(repo),
  );

  const r = Router();

  r.use(requireAuth);
  r.use(enrichUserRoles);
  r.use(requireRole('admin'));
  r.get('/', controller.handle(controller.list));
  r.post('/', controller.handle(controller.create));
  r.delete('/:name', controller.handle(controller.delete));

  return r;
}
