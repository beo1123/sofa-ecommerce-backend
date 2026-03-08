import { Request, Response } from 'express';
import { z } from 'zod';
import { BaseController } from '../../../shared/http/base-controller.js';
import { ok } from '../../../shared/http/api-response.js';
import { CreateCouponUseCase } from '../application/create-coupon.usecase.js';
import { UpdateCouponUseCase } from '../application/update-coupon.usecase.js';
import { DeleteCouponUseCase } from '../application/delete-coupon.usecase.js';
import { GetCouponUseCase } from '../application/get-coupon.usecase.js';
import { ListCouponsUseCase } from '../application/list-coupons.usecase.js';
import { ApplyCouponUseCase } from '../application/apply-coupon.usecase.js';

export class CouponController extends BaseController {
  constructor(
    private readonly createUC: CreateCouponUseCase,
    private readonly updateUC: UpdateCouponUseCase,
    private readonly deleteUC: DeleteCouponUseCase,
    private readonly getUC: GetCouponUseCase,
    private readonly listUC: ListCouponsUseCase,
    private readonly applyUC: ApplyCouponUseCase,
  ) {
    super();
  }

  apply = async (req: Request, res: Response) => {
    const schema = z.object({
      code: z.string().min(1),
      subtotal: z.number().positive(),
    });
    const input = schema.parse(req.body);
    const result = await this.applyUC.execute(input);
    res.json(ok(result));
  };

  list = async (req: Request, res: Response) => {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const result = await this.listUC.execute(limit, offset);
    res.json(ok(result));
  };

  getById = async (req: Request, res: Response) => {
    const result = await this.getUC.execute(req.params.id);
    res.json(ok(result));
  };

  create = async (req: Request, res: Response) => {
    const schema = z.object({
      code: z.string().min(2),
      type: z.enum(['FIXED', 'PERCENT']),
      amount: z.number().positive().optional(),
      percent: z.number().min(1).max(100).optional(),
      description: z.string().optional(),
      startsAt: z
        .string()
        .datetime()
        .optional()
        .transform((v) => (v ? new Date(v) : undefined)),
      expiresAt: z
        .string()
        .datetime()
        .optional()
        .transform((v) => (v ? new Date(v) : undefined)),
      usageLimit: z.number().int().positive().optional(),
      usagePerUser: z.number().int().positive().optional(),
      active: z.boolean().optional(),
      metadata: z.unknown().optional(),
    });
    const input = schema.parse(req.body);
    const result = await this.createUC.execute(input);
    res.status(201).json(ok(result));
  };

  update = async (req: Request, res: Response) => {
    const schema = z.object({
      code: z.string().min(2).optional(),
      type: z.enum(['FIXED', 'PERCENT']).optional(),
      amount: z.number().positive().nullable().optional(),
      percent: z.number().min(1).max(100).nullable().optional(),
      description: z.string().nullable().optional(),
      startsAt: z
        .string()
        .datetime()
        .nullable()
        .optional()
        .transform((v): Date | null | undefined => (v != null ? new Date(v) : v)),
      expiresAt: z
        .string()
        .datetime()
        .nullable()
        .optional()
        .transform((v): Date | null | undefined => (v != null ? new Date(v) : v)),
      usageLimit: z.number().int().positive().nullable().optional(),
      usagePerUser: z.number().int().positive().nullable().optional(),
      active: z.boolean().optional(),
      metadata: z.unknown().optional(),
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
