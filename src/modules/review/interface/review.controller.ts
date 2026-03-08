import { Request, Response } from 'express';
import { z } from 'zod';
import { BaseController } from '../../../shared/http/base-controller.js';
import { ok } from '../../../shared/http/api-response.js';
import { CreateReviewUseCase } from '../application/create-review.usecase.js';
import { UpdateReviewUseCase } from '../application/update-review.usecase.js';
import { DeleteReviewUseCase } from '../application/delete-review.usecase.js';
import { ListReviewsUseCase } from '../application/list-reviews.usecase.js';
import { ApproveReviewUseCase } from '../application/approve-review.usecase.js';
import { GetMyReviewsUseCase } from '../application/get-my-reviews.usecase.js';

export class ReviewController extends BaseController {
  constructor(
    private readonly createUC: CreateReviewUseCase,
    private readonly updateUC: UpdateReviewUseCase,
    private readonly deleteUC: DeleteReviewUseCase,
    private readonly listUC: ListReviewsUseCase,
    private readonly approveUC: ApproveReviewUseCase,
    private readonly myReviewsUC: GetMyReviewsUseCase,
  ) {
    super();
  }

  listByProduct = async (req: Request, res: Response) => {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const result = await this.listUC.execute(req.params.productId, true, limit, offset);
    res.json(ok(result));
  };

  getMyReviews = async (req: Request, res: Response) => {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await this.myReviewsUC.execute((req as any).user.id, limit, offset);
    res.json(ok(result));
  };

  create = async (req: Request, res: Response) => {
    const schema = z.object({
      productId: z.string().uuid(),
      rating: z.number().int().min(1).max(5),
      title: z.string().max(255).optional(),
      body: z.string().optional(),
    });
    const input = schema.parse(req.body);
    const result = await this.createUC.execute({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      userId: (req as any).user.id,
      ...input,
    });
    res.status(201).json(ok(result));
  };

  update = async (req: Request, res: Response) => {
    const schema = z.object({
      rating: z.number().int().min(1).max(5).optional(),
      title: z.string().max(255).nullable().optional(),
      body: z.string().nullable().optional(),
    });
    const input = schema.parse(req.body);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await this.updateUC.execute(req.params.id, (req as any).user.id, input);
    res.json(ok(result));
  };

  delete = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (req as any).user;
    const isAdmin = Array.isArray(user.roles) && user.roles.includes('admin');
    await this.deleteUC.execute(req.params.id, user.id, isAdmin);
    res.json(ok({}));
  };

  approve = async (req: Request, res: Response) => {
    const schema = z.object({ approved: z.boolean() });
    const { approved } = schema.parse(req.body);
    const result = await this.approveUC.execute(req.params.id, approved);
    res.json(ok(result));
  };
}
