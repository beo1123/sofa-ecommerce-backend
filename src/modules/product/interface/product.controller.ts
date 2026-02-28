/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { z } from 'zod';
import { BaseController } from '../../../shared/http/base-controller.js';
import { SearchProductsUseCase } from '../application/search-products.usecase.js';
import { GetProductBySlugUseCase } from '../application/get-product-by-slug.usecase.js';
import { GetRelatedProductsUseCase } from '../application/related-products.usecase.js';
import { GetBestSellingProductsUseCase } from '../application/best-selling-products.usecase.js';
import { GetFeaturedProductsUseCase } from '../application/featured-products.usecase.js';
import { GetFiltersUseCase } from '../application/get-filters.usecase.js';
import { CreateProductUseCase } from '../application/create-product.usecase.js';
import { UpdateProductUseCase } from '../application/update-product.usecase.js';
import { DeleteProductUseCase } from '../application/delete-product.usecase.js';
// status management moved to product-status module
// image & variant operations have been split into their own modules
import { GetProductByIdUseCase } from '../application/get-product-by-id.usecase.js';
import { ok } from '../../../shared/http/api-response.js';

export class ProductController extends BaseController {
  constructor(
    private readonly searchUC: SearchProductsUseCase,
    private readonly getUC: GetProductBySlugUseCase,
    private readonly getByIdUC: GetProductByIdUseCase,
    private readonly relatedUC: GetRelatedProductsUseCase,
    private readonly bestUC: GetBestSellingProductsUseCase,
    private readonly featuredUC: GetFeaturedProductsUseCase,
    private readonly filtersUC: GetFiltersUseCase,
    private readonly createUC: CreateProductUseCase,
    private readonly updateUC: UpdateProductUseCase,
    private readonly deleteUC: DeleteProductUseCase,
  ) {
    super();
  }

  list = async (req: Request, res: Response) => {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const perPage = Math.min(parseInt(req.query.perPage as string) || 20, 100);
    const params: any = { page, limit: perPage };
    if (req.query.category) params.categorySlug = String(req.query.category);
    if (req.query.priceMin) params.minPrice = Number(req.query.priceMin);
    if (req.query.priceMax) params.maxPrice = Number(req.query.priceMax);
    if (req.query.color) params.color = String(req.query.color);
    if (req.query.material) params.material = String(req.query.material);
    if (req.query.q) params.q = String(req.query.q);
    if (req.query.sort) params.sort = String(req.query.sort) as any;

    const result = await this.searchUC.execute(params);
    res.json(ok(result));
  };

  getBySlug = async (req: Request, res: Response) => {
    const result = await this.getUC.execute(req.params.slug);
    res.json(ok(result));
  };

  related = async (req: Request, res: Response) => {
    const items = await this.relatedUC.execute(req.params.slug);
    res.json(ok(items));
  };

  search = async (req: Request, res: Response) => {
    // alias for list with q param
    await this.list(req, res);
  };

  bestSelling = async (_req: Request, res: Response) => {
    const limit = Math.min(parseInt(_req.query.limit as string) || 8, 100);
    const items = await this.bestUC.execute(limit);
    res.json(ok(items));
  };

  featured = async (_req: Request, res: Response) => {
    const limit = Math.min(parseInt(_req.query.limit as string) || 8, 100);
    const items = await this.featuredUC.execute(limit);
    res.json(ok(items));
  };

  filters = async (_req: Request, res: Response) => {
    const data = await this.filtersUC.execute();
    res.json(ok(data));
  };

  // ---------- ADMIN ----------
  // status, image and variant endpoints have been relocated to their own modules
  create = async (req: Request, res: Response) => {
    const schema = z.object({
      title: z.string().min(2),
      slug: z.string().optional(),
      shortDescription: z.string().optional(),
      description: z.string().optional(),
      categoryId: z.string().uuid().optional(),
      status: z.string().optional(),
    });

    const input = schema.parse(req.body);
    const result = await this.createUC.execute(input);
    res.status(201).json(ok(result));
  };

  update = async (req: Request, res: Response) => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const bodySchema = z.object({
      title: z.string().min(2).optional(),
      slug: z.string().optional(),
      shortDescription: z.string().optional(),
      description: z.string().optional(),
      categoryId: z.string().uuid().optional(),
      status: z.string().optional(),
    });

    const { id } = paramsSchema.parse(req.params);
    const body = bodySchema.parse(req.body);
    const result = await this.updateUC.execute(id, body);
    res.json(ok(result));
  };

  delete = async (req: Request, res: Response) => {
    const schema = z.object({ id: z.string().uuid() });
    const { id } = schema.parse(req.params);
    await this.deleteUC.execute(id);
    res.json(ok({}));
  };

  getById = async (req: Request, res: Response) => {
    const schema = z.object({ id: z.string().uuid() });
    const { id } = schema.parse(req.params);
    const product = await this.getByIdUC.execute(id);
    res.json(ok(product));
  };
}
