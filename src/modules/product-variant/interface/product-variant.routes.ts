import { Router } from 'express';
import { PgProductRepository } from '../../product/infrastructure/product.repo.pg.js';
import { AddVariantUseCase } from '../application/add-variant.usecase.js';
import { UpdateVariantUseCase } from '../application/update-variant.usecase.js';
import { UpdateInventoryUseCase } from '../application/update-inventory.usecase.js';
import { ProductVariantController } from './product-variant.controller.js';
import { requireAuth } from '../../../shared/auth/auth.middleware.js';
import { requireRole } from '../../../shared/auth/auth.middleware.js';
import { enrichUserRoles } from '../../../shared/auth/role.middleware.js';

export function createProductVariantRouter(): Router {
  const repo = new PgProductRepository();
  const controller = new ProductVariantController(
    new AddVariantUseCase(repo),
    new UpdateVariantUseCase(repo),
    new UpdateInventoryUseCase(repo),
  );

  const r = Router();

  r.use(requireAuth);
  r.use(enrichUserRoles);
  r.use(requireRole('admin'));

  r.post('/:id', controller.handle(controller.add));
  r.patch('/:variantId', controller.handle(controller.update));
  r.patch('/:variantId/inventory', controller.handle(controller.updateInventory));

  return r;
}
