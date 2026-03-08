/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { z } from 'zod';
import { BaseController } from '../../../shared/http/base-controller.js';
import { ok } from '../../../shared/http/api-response.js';
import { CreateArticleCategoryUseCase } from '../application/create-article-category.usecase.js';
import { ListArticleCategoriesUseCase } from '../application/list-article-categories.usecase.js';
import { CreateArticleUseCase } from '../application/create-article.usecase.js';
import { UpdateArticleUseCase } from '../application/update-article.usecase.js';
import { DeleteArticleUseCase } from '../application/delete-article.usecase.js';
import { GetArticleUseCase } from '../application/get-article.usecase.js';
import { ListArticlesUseCase } from '../application/list-articles.usecase.js';

export class ArticleController extends BaseController {
  constructor(
    private readonly createCategoryUC: CreateArticleCategoryUseCase,
    private readonly listCategoriesUC: ListArticleCategoriesUseCase,
    private readonly createUC: CreateArticleUseCase,
    private readonly updateUC: UpdateArticleUseCase,
    private readonly deleteUC: DeleteArticleUseCase,
    private readonly getUC: GetArticleUseCase,
    private readonly listUC: ListArticlesUseCase,
  ) {
    super();
  }

  listCategories = async (_req: Request, res: Response) => {
    const result = await this.listCategoriesUC.execute();
    res.json(ok(result));
  };

  createCategory = async (req: Request, res: Response) => {
    const schema = z.object({ name: z.string().min(2) });
    const input = schema.parse(req.body);
    const result = await this.createCategoryUC.execute(input);
    res.status(201).json(ok(result));
  };

  list = async (req: Request, res: Response) => {
    const userRoles: string[] = (req as any).userRoles ?? [];
    const isAdmin = userRoles.map((r) => r.toLowerCase()).includes('admin');
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const categoryId = req.query.categoryId as string | undefined;

    const result = await this.listUC.execute({ isAdmin, limit, offset, categoryId });
    res.json(ok(result));
  };

  getBySlug = async (req: Request, res: Response) => {
    const result = await this.getUC.executeBySlug(req.params.slug);
    res.json(ok(result));
  };

  getById = async (req: Request, res: Response) => {
    const result = await this.getUC.execute(req.params.id);
    res.json(ok(result));
  };

  create = async (req: Request, res: Response) => {
    const schema = z.object({
      title: z.string().min(1),
      excerpt: z.string().nullable().optional(),
      content: z.string().min(1),
      thumbnail: z.string().nullable().optional(),
      status: z.enum(['PUBLISHED', 'DRAFT']).optional(),
      publishedAt: z.coerce.date().nullable().optional(),
      categoryId: z.string().uuid().nullable().optional(),
    });

    const input = schema.parse(req.body);
    const authorId = (req as any).user?.sub ?? null;

    const result = await this.createUC.execute({ ...input, authorId });
    res.status(201).json(ok(result));
  };

  update = async (req: Request, res: Response) => {
    const schema = z.object({
      title: z.string().min(1).optional(),
      excerpt: z.string().nullable().optional(),
      content: z.string().min(1).optional(),
      thumbnail: z.string().nullable().optional(),
      status: z.enum(['PUBLISHED', 'DRAFT']).optional(),
      publishedAt: z.coerce.date().nullable().optional(),
      categoryId: z.string().uuid().nullable().optional(),
    });

    const input = schema.parse(req.body);
    const result = await this.updateUC.execute(req.params.id, input);
    res.json(ok(result));
  };

  delete = async (req: Request, res: Response) => {
    await this.deleteUC.execute(req.params.id);
    res.json(ok({}));
  };
}
