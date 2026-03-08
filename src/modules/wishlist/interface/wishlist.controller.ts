import { Request, Response } from 'express';
import { z } from 'zod';
import { BaseController } from '../../../shared/http/base-controller.js';
import { ok } from '../../../shared/http/api-response.js';
import { GetWishlistUseCase } from '../application/get-wishlist.usecase.js';
import { AddItemUseCase } from '../application/add-item.usecase.js';
import { RemoveItemUseCase } from '../application/remove-item.usecase.js';
import { ClearWishlistUseCase } from '../application/clear-wishlist.usecase.js';

export class WishlistController extends BaseController {
  constructor(
    private readonly getUC: GetWishlistUseCase,
    private readonly addItemUC: AddItemUseCase,
    private readonly removeItemUC: RemoveItemUseCase,
    private readonly clearUC: ClearWishlistUseCase,
  ) {
    super();
  }

  get = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await this.getUC.execute((req as any).user.sub);
    res.json(ok(result));
  };

  addItem = async (req: Request, res: Response) => {
    const schema = z.object({
      productId: z.string().uuid(),
      variantId: z.string().uuid().optional(),
    });
    const input = schema.parse(req.body);
    const result = await this.addItemUC.execute({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      userId: (req as any).user.sub,
      ...input,
    });
    res.status(201).json(ok(result));
  };

  removeItem = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await this.removeItemUC.execute(req.params.itemId, (req as any).user.sub);
    res.json(ok({}));
  };

  clear = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await this.clearUC.execute((req as any).user.sub);
    res.json(ok({}));
  };
}
