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
import { AddProductImageUseCase } from '../application/add-product-image.usecase.js';
import { RemoveProductImageUseCase } from '../application/remove-product-image.usecase.js';
import { SetPrimaryImageUseCase } from '../application/set-primary-image.usecase.js';
import { AddVariantUseCase } from '../application/add-variant.usecase.js';
import { UpdateVariantUseCase } from '../application/update-variant.usecase.js';
import { UpdateInventoryUseCase } from '../application/update-inventory.usecase.js';
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
    private readonly addImageUC: AddProductImageUseCase,
    private readonly removeImageUC: RemoveProductImageUseCase,
    private readonly setPrimaryImageUC: SetPrimaryImageUseCase,
    private readonly addVariantUC: AddVariantUseCase,
    private readonly updateVariantUC: UpdateVariantUseCase,
    private readonly updateInventoryUC: UpdateInventoryUseCase,
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

  addImage = async (req: Request, res: Response) => {
    const params = z.object({ id: z.string().uuid() }).parse(req.params);
    const body = z
      .object({
        url: z.string().url(),
        alt: z.string().optional(),
        isPrimary: z.boolean().optional(),
      })
      .parse(req.body);
    const result = await this.addImageUC.execute({ productId: params.id, ...body });
    res.status(201).json(ok(result));
  };

  removeImage = async (req: Request, res: Response) => {
    const schema = z.object({ imageId: z.string().uuid() });
    const { imageId } = schema.parse(req.params);
    await this.removeImageUC.execute(imageId);
    res.json(ok({}));
  };

  setPrimaryImage = async (req: Request, res: Response) => {
    const params = z
      .object({ id: z.string().uuid(), imageId: z.string().uuid() })
      .parse(req.params);
    await this.setPrimaryImageUC.execute(params.id, params.imageId);
    res.json(ok({}));
  };

  addVariant = async (req: Request, res: Response) => {
    const params = z.object({ id: z.string().uuid() }).parse(req.params);
    const body = z
      .object({
        name: z.string().min(1),
        skuPrefix: z.string().optional(),
        colorCode: z.string().optional(),
        colorName: z.string().optional(),
        material: z.string().optional(),
        price: z.number().nonnegative(),
        compareAtPrice: z.number().nonnegative().optional(),
        image: z.string().optional(),
      })
      .parse(req.body);
    const result = await this.addVariantUC.execute({ productId: params.id, ...body });
    res.status(201).json(ok(result));
  };

  updateVariant = async (req: Request, res: Response) => {
    const params = z.object({ variantId: z.string().uuid() }).parse(req.params);
    const body = z
      .object({
        name: z.string().min(1).optional(),
        price: z.number().nonnegative().optional(),
        compareAtPrice: z.number().nonnegative().optional(),
        image: z.string().optional(),
        colorCode: z.string().optional(),
        colorName: z.string().optional(),
        material: z.string().optional(),
      })
      .parse(req.body);
    await this.updateVariantUC.execute(params.variantId, body);
    res.json(ok({}));
  };

  updateInventory = async (req: Request, res: Response) => {
    const params = z.object({ variantId: z.string().uuid() }).parse(req.params);
    const body = z
      .object({ quantity: z.number().int(), reserved: z.number().int().optional() })
      .parse(req.body);
    await this.updateInventoryUC.execute(params.variantId, body);
    res.json(ok({}));
  };
}
