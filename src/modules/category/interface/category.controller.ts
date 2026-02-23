import { Request, Response } from 'express';
import { z } from 'zod';
import { BaseController } from '../../../shared/http/base-controller.js';
import { CreateCategoryUseCase } from '../application/create-category.usecase.js';
import { UpdateCategoryUseCase } from '../application/update-category.usecase.js';
import { DeleteCategoryUseCase } from '../application/delete-category.usecase.js';
import { GetCategoryUseCase } from '../application/get-category.usecase.js';
import { ListCategoriesUseCase } from '../application/list-categories.usecase.js';
import { ok } from '../../../shared/http/api-response.js';

export class CategoryController extends BaseController {
  constructor(
    private readonly createUC: CreateCategoryUseCase,
    private readonly updateUC: UpdateCategoryUseCase,
    private readonly deleteUC: DeleteCategoryUseCase,
    private readonly getUC: GetCategoryUseCase,
    private readonly listUC: ListCategoriesUseCase,
  ) {
    super();
  }

  create = async (req: Request, res: Response) => {
    const schema = z.object({
      name: z.string().min(2),
      image: z.string().optional(),
    });

    const input = schema.parse(req.body);
    const result = await this.createUC.execute(input);

    res.status(201).json(ok(result));
  };

  update = async (req: Request, res: Response) => {
    const schema = z.object({
      name: z.string().min(2).optional(),
      image: z.string().optional(),
    });

    const input = schema.parse(req.body);
    const result = await this.updateUC.execute(req.params.id, input);

    res.json(ok(result));
  };

  delete = async (req: Request, res: Response) => {
    await this.deleteUC.execute(req.params.id);
    res.json(ok({}));
  };

  getById = async (req: Request, res: Response) => {
    const result = await this.getUC.execute(req.params.id);
    res.json(ok(result));
  };

  getBySlug = async (req: Request, res: Response) => {
    const result = await this.getUC.executeBySlug(req.params.slug);
    res.json(ok(result));
  };

  list = async (req: Request, res: Response) => {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await this.listUC.execute(limit, offset);
    res.json(ok(result));
  };
}
