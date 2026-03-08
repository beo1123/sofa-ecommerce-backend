import { Router } from 'express';
import { requireAuth, requireRole } from '../../../shared/auth/auth.middleware.js';
import { enrichUserRoles } from '../../../shared/auth/role.middleware.js';
import {
  PgArticleCategoryRepository,
  PgArticleRepository,
} from '../infrastructure/article.repo.pg.js';
import { CreateArticleCategoryUseCase } from '../application/create-article-category.usecase.js';
import { ListArticleCategoriesUseCase } from '../application/list-article-categories.usecase.js';
import { CreateArticleUseCase } from '../application/create-article.usecase.js';
import { UpdateArticleUseCase } from '../application/update-article.usecase.js';
import { DeleteArticleUseCase } from '../application/delete-article.usecase.js';
import { GetArticleUseCase } from '../application/get-article.usecase.js';
import { ListArticlesUseCase } from '../application/list-articles.usecase.js';
import { ArticleController } from './article.controller.js';

export function createArticleRouter(): Router {
  const categoryRepo = new PgArticleCategoryRepository();
  const articleRepo = new PgArticleRepository();

  const createCategoryUC = new CreateArticleCategoryUseCase(categoryRepo);
  const listCategoriesUC = new ListArticleCategoriesUseCase(categoryRepo);
  const createUC = new CreateArticleUseCase(articleRepo);
  const updateUC = new UpdateArticleUseCase(articleRepo);
  const deleteUC = new DeleteArticleUseCase(articleRepo);
  const getUC = new GetArticleUseCase(articleRepo);
  const listUC = new ListArticlesUseCase(articleRepo);

  const controller = new ArticleController(
    createCategoryUC,
    listCategoriesUC,
    createUC,
    updateUC,
    deleteUC,
    getUC,
    listUC,
  );

  const r = Router();

  // =========================================================
  // Article categories
  // =========================================================
  r.get('/categories', controller.handle(controller.listCategories));
  r.post(
    '/categories',
    requireAuth,
    enrichUserRoles,
    requireRole('admin'),
    controller.handle(controller.createCategory),
  );

  // =========================================================
  // Public article routes
  // =========================================================
  r.get('/', controller.handle(controller.list));
  r.get('/by-slug/:slug', controller.handle(controller.getBySlug));

  // =========================================================
  // Protected: admin article management
  // =========================================================
  r.get(
    '/:id',
    requireAuth,
    enrichUserRoles,
    requireRole('admin'),
    controller.handle(controller.getById),
  );
  r.post(
    '/',
    requireAuth,
    enrichUserRoles,
    requireRole('admin'),
    controller.handle(controller.create),
  );
  r.patch(
    '/:id',
    requireAuth,
    enrichUserRoles,
    requireRole('admin'),
    controller.handle(controller.update),
  );
  r.delete(
    '/:id',
    requireAuth,
    enrichUserRoles,
    requireRole('admin'),
    controller.handle(controller.delete),
  );

  return r;
}
