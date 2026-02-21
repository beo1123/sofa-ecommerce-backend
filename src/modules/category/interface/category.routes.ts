import { Router } from 'express';
import { PgCategoryRepository } from '../infrastructure/category.repo.pg.js';
import { CreateCategoryUseCase } from '../application/create-category.usecase.js';
import { UpdateCategoryUseCase } from '../application/update-category.usecase.js';
import { DeleteCategoryUseCase } from '../application/delete-category.usecase.js';
import { GetCategoryUseCase } from '../application/get-category.usecase.js';
import { ListCategoriesUseCase } from '../application/list-categories.usecase.js';
import { CategoryController } from './category.controller.js';
import { requireAuth } from '../../../shared/auth/auth.middleware.js';
import { requireRole } from '../../../shared/auth/auth.middleware.js';

export function createCategoryRouter(): Router {
  const categoryRepo = new PgCategoryRepository();

  const createUC = new CreateCategoryUseCase(categoryRepo);
  const updateUC = new UpdateCategoryUseCase(categoryRepo);
  const deleteUC = new DeleteCategoryUseCase(categoryRepo);
  const getUC = new GetCategoryUseCase(categoryRepo);
  const listUC = new ListCategoriesUseCase(categoryRepo);

  const controller = new CategoryController(createUC, updateUC, deleteUC, getUC, listUC);

  const r = Router();

  // =========================================================
  // PUBLIC: Category listing routes
  // =========================================================
  r.get('/', controller.handle(controller.list));
  r.get('/by-slug/:slug', controller.handle(controller.getBySlug));
  r.get('/:id', controller.handle(controller.getById));

  // =========================================================
  // PROTECTED: Admin category management
  // =========================================================
  r.use(requireAuth);
  r.use(requireRole('admin'));

  r.post('/', controller.handle(controller.create));
  r.patch('/:id', controller.handle(controller.update));
  r.delete('/:id', controller.handle(controller.delete));

  return r;
}
