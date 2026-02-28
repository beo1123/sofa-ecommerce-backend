import { Request, Response } from 'express';
import { BaseController } from '../../../shared/http/base-controller.js';
import { AddVariantUseCase } from '../application/add-variant.usecase.js';
import { UpdateVariantUseCase } from '../application/update-variant.usecase.js';
import { UpdateInventoryUseCase } from '../application/update-inventory.usecase.js';
import { z } from 'zod';
import { ok } from '../../../shared/http/api-response.js';

export class ProductVariantController extends BaseController {
  constructor(
    private readonly addUC: AddVariantUseCase,
    private readonly updateUC: UpdateVariantUseCase,
    private readonly inventoryUC: UpdateInventoryUseCase,
  ) {
    super();
  }

  add = async (req: Request, res: Response) => {
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
    const result = await this.addUC.execute({ productId: params.id, ...body });
    res.status(201).json(ok(result));
  };

  update = async (req: Request, res: Response) => {
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
    await this.updateUC.execute(params.variantId, body);
    res.json(ok({}));
  };

  updateInventory = async (req: Request, res: Response) => {
    const params = z.object({ variantId: z.string().uuid() }).parse(req.params);
    const body = z
      .object({ quantity: z.number().int(), reserved: z.number().int().optional() })
      .parse(req.body);
    await this.inventoryUC.execute(params.variantId, body);
    res.json(ok({}));
  };
}
