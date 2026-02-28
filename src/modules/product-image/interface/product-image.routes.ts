import { Router } from 'express';
import { PgProductRepository } from '../../product/infrastructure/product.repo.pg.js';
import { AddProductImageUseCase } from '../application/add-product-image.usecase.js';
import { RemoveProductImageUseCase } from '../application/remove-product-image.usecase.js';
import { SetPrimaryImageUseCase } from '../application/set-primary-image.usecase.js';
import { ProductImageController } from './product-image.controller.js';
import { requireAuth } from '../../../shared/auth/auth.middleware.js';
import { requireRole } from '../../../shared/auth/auth.middleware.js';
import { enrichUserRoles } from '../../../shared/auth/role.middleware.js';

export function createProductImageRouter(): Router {
  const repo = new PgProductRepository();
  const controller = new ProductImageController(
    new AddProductImageUseCase(repo),
    new RemoveProductImageUseCase(repo),
    new SetPrimaryImageUseCase(repo),
  );

  const r = Router();
  // public operations should be covered only through variants or product details
  // images manipulations require auth

  r.use(requireAuth);
  r.use(enrichUserRoles);
  r.use(requireRole('admin'));

  r.post('/:id', controller.handle(controller.add));
  r.delete('/:imageId', controller.handle(controller.remove));
  r.patch('/:id/:imageId/primary', controller.handle(controller.setPrimary));

  return r;
}
