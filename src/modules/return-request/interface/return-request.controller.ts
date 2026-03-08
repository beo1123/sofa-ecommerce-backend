/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { z } from 'zod';
import { BaseController } from '../../../shared/http/base-controller.js';
import { ok } from '../../../shared/http/api-response.js';
import { CreateReturnRequestUseCase } from '../application/create-return-request.usecase.js';
import { GetReturnRequestUseCase } from '../application/get-return-request.usecase.js';
import { ListReturnRequestsUseCase } from '../application/list-return-requests.usecase.js';
import { ProcessReturnRequestUseCase } from '../application/process-return-request.usecase.js';

export class ReturnRequestController extends BaseController {
  constructor(
    private readonly createUC: CreateReturnRequestUseCase,
    private readonly getUC: GetReturnRequestUseCase,
    private readonly listUC: ListReturnRequestsUseCase,
    private readonly processUC: ProcessReturnRequestUseCase,
  ) {
    super();
  }

  list = async (req: Request, res: Response) => {
    const userId = (req as any).user.sub;
    const userRoles: string[] = (req as any).userRoles ?? [];
    const isAdmin = userRoles.map((r) => r.toLowerCase()).includes('admin');

    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const status = req.query.status as string | undefined;

    const result = await this.listUC.execute({ userId, isAdmin, status, limit, offset });
    res.json(ok(result));
  };

  getById = async (req: Request, res: Response) => {
    const userId = (req as any).user.sub;
    const userRoles: string[] = (req as any).userRoles ?? [];
    const isAdmin = userRoles.map((r) => r.toLowerCase()).includes('admin');

    const result = await this.getUC.execute({ id: req.params.id, userId, isAdmin });
    res.json(ok(result));
  };

  create = async (req: Request, res: Response) => {
    const schema = z.object({
      orderId: z.string().uuid(),
      orderItemId: z.string().uuid(),
      reason: z.string().min(1),
      evidence: z.unknown().optional(),
      metadata: z.unknown().optional(),
    });

    const input = schema.parse(req.body);
    const result = await this.createUC.execute(input);
    res.status(201).json(ok(result));
  };

  process = async (req: Request, res: Response) => {
    const schema = z.object({
      status: z.enum(['APPROVED', 'REJECTED', 'COMPLETED']),
    });

    const { status } = schema.parse(req.body);
    const result = await this.processUC.execute({ id: req.params.id, status });
    res.json(ok(result));
  };
}
