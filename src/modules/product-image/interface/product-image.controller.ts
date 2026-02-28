import { Request, Response } from 'express';
import { BaseController } from '../../../shared/http/base-controller.js';
import { AddProductImageUseCase } from '../application/add-product-image.usecase.js';
import { RemoveProductImageUseCase } from '../application/remove-product-image.usecase.js';
import { SetPrimaryImageUseCase } from '../application/set-primary-image.usecase.js';
import { z } from 'zod';
import { ok } from '../../../shared/http/api-response.js';

export class ProductImageController extends BaseController {
  constructor(
    private readonly addUC: AddProductImageUseCase,
    private readonly removeUC: RemoveProductImageUseCase,
    private readonly setPrimaryUC: SetPrimaryImageUseCase,
  ) {
    super();
  }

  add = async (req: Request, res: Response) => {
    const params = z.object({ id: z.string().uuid() }).parse(req.params);
    const body = z
      .object({
        url: z.string().url(),
        alt: z.string().optional(),
        isPrimary: z.boolean().optional(),
      })
      .parse(req.body);
    const result = await this.addUC.execute({ productId: params.id, ...body });
    res.status(201).json(ok(result));
  };

  remove = async (req: Request, res: Response) => {
    const schema = z.object({ imageId: z.string().uuid() });
    const { imageId } = schema.parse(req.params);
    await this.removeUC.execute(imageId);
    res.json(ok({}));
  };

  setPrimary = async (req: Request, res: Response) => {
    const params = z
      .object({ id: z.string().uuid(), imageId: z.string().uuid() })
      .parse(req.params);
    await this.setPrimaryUC.execute(params.id, params.imageId);
    res.json(ok({}));
  };
}
