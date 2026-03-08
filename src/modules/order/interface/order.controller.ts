/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { z } from 'zod';
import { BaseController } from '../../../shared/http/base-controller.js';
import { ok } from '../../../shared/http/api-response.js';
import { CreateOrderUseCase } from '../application/create-order.usecase.js';
import { GetOrderUseCase } from '../application/get-order.usecase.js';
import { ListOrdersUseCase } from '../application/list-orders.usecase.js';
import { UpdateOrderStatusUseCase } from '../application/update-order-status.usecase.js';
import { CancelOrderUseCase } from '../application/cancel-order.usecase.js';

export class OrderController extends BaseController {
  constructor(
    private readonly createUC: CreateOrderUseCase,
    private readonly getUC: GetOrderUseCase,
    private readonly listUC: ListOrdersUseCase,
    private readonly updateStatusUC: UpdateOrderStatusUseCase,
    private readonly cancelUC: CancelOrderUseCase,
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
    const itemSchema = z.object({
      productId: z.string().uuid().optional(),
      variantId: z.string().uuid().optional(),
      sku: z.string().optional(),
      name: z.string().min(1),
      price: z.string(),
      quantity: z.number().int().positive(),
      total: z.string(),
    });

    const schema = z.object({
      shippingAddressId: z.string().uuid().optional(),
      billingAddressId: z.string().uuid().optional(),
      recipientName: z.string().min(1),
      phone: z.string().min(1),
      email: z.string().email().optional(),
      line1: z.string().min(1),
      city: z.string().optional(),
      province: z.string().min(1),
      country: z.string().optional(),
      paymentMethod: z.string().min(1),
      couponId: z.string().uuid().optional(),
      shipping: z.string().optional(),
      tax: z.string().optional(),
      items: z.array(itemSchema).min(1),
    });

    const input = schema.parse(req.body);
    const userId = (req as any).user.sub;

    const result = await this.createUC.execute({ ...input, userId });
    res.status(201).json(ok(result));
  };

  updateStatus = async (req: Request, res: Response) => {
    const schema = z.object({
      status: z.enum(['CREATED', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED']),
    });

    const { status } = schema.parse(req.body);
    await this.updateStatusUC.execute({ id: req.params.id, status });
    res.json(ok({}));
  };

  cancel = async (req: Request, res: Response) => {
    const userId = (req as any).user.sub;
    const userRoles: string[] = (req as any).userRoles ?? [];
    const isAdmin = userRoles.map((r) => r.toLowerCase()).includes('admin');

    await this.cancelUC.execute({ id: req.params.id, userId, isAdmin });
    res.json(ok({}));
  };
}
