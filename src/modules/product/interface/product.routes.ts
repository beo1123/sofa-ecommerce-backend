import { Router } from 'express';
import { PgProductRepository } from '../infrastructure/product.repo.pg.js';
import { SearchProductsUseCase } from '../application/search-products.usecase.js';
import { GetProductBySlugUseCase } from '../application/get-product-by-slug.usecase.js';
import { GetProductByIdUseCase } from '../application/get-product-by-id.usecase.js';
import { GetRelatedProductsUseCase } from '../application/related-products.usecase.js';
import { GetBestSellingProductsUseCase } from '../application/best-selling-products.usecase.js';
import { GetFeaturedProductsUseCase } from '../application/featured-products.usecase.js';
import { GetFiltersUseCase } from '../application/get-filters.usecase.js';
import { CreateProductUseCase } from '../application/create-product.usecase.js';
import { UpdateProductUseCase } from '../application/update-product.usecase.js';
import { DeleteProductUseCase } from '../application/delete-product.usecase.js';
// product status, image and variant operations are handled by separate modules
import { ProductController } from './product.controller.js';
import { requireAuth } from '../../../shared/auth/auth.middleware.js';
import { requireRole } from '../../../shared/auth/auth.middleware.js';
import { enrichUserRoles } from '../../../shared/auth/role.middleware.js';

export function createProductRouter(): Router {
  const repo = new PgProductRepository();
  const searchUC = new SearchProductsUseCase(repo);
  const getUC = new GetProductBySlugUseCase(repo);
  const relatedUC = new GetRelatedProductsUseCase(repo);
  const bestUC = new GetBestSellingProductsUseCase(repo);
  const featuredUC = new GetFeaturedProductsUseCase(repo);
  const filtersUC = new GetFiltersUseCase(repo);
  const controller = new ProductController(
    searchUC,
    getUC,
    new GetProductByIdUseCase(repo),
    relatedUC,
    bestUC,
    featuredUC,
    filtersUC,
    new CreateProductUseCase(repo),
    new UpdateProductUseCase(repo),
    new DeleteProductUseCase(repo),
  );

  const r = Router();
  // PUBLIC
  r.get('/', controller.handle(controller.list));
  r.get('/by-slug/:slug', controller.handle(controller.getBySlug));
  r.get('/related/:slug', controller.handle(controller.related));
  r.get('/search', controller.handle(controller.search));
  r.get('/best-selling', controller.handle(controller.bestSelling));
  r.get('/featured', controller.handle(controller.featured));
  r.get('/filters', controller.handle(controller.filters));

  // protected admin endpoints
  r.use(requireAuth);
  r.use(enrichUserRoles);
  r.use(requireRole('admin'));

  // product management
  r.post('/', controller.handle(controller.create));
  r.get('/:id', controller.handle(controller.getById));
  r.patch('/:id', controller.handle(controller.update));
  r.delete('/:id', controller.handle(controller.delete));

  return r;
}
