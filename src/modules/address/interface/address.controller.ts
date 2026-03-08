/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { z } from 'zod';
import { BaseController } from '../../../shared/http/base-controller.js';
import { ok } from '../../../shared/http/api-response.js';
import { CreateAddressUseCase } from '../application/create-address.usecase.js';
import { UpdateAddressUseCase } from '../application/update-address.usecase.js';
import { DeleteAddressUseCase } from '../application/delete-address.usecase.js';
import { ListAddressesUseCase } from '../application/list-addresses.usecase.js';
import { GetAddressUseCase } from '../application/get-address.usecase.js';
import { SetDefaultAddressUseCase } from '../application/set-default-address.usecase.js';

export class AddressController extends BaseController {
  constructor(
    private readonly createUC: CreateAddressUseCase,
    private readonly updateUC: UpdateAddressUseCase,
    private readonly deleteUC: DeleteAddressUseCase,
    private readonly listUC: ListAddressesUseCase,
    private readonly getUC: GetAddressUseCase,
    private readonly setDefaultUC: SetDefaultAddressUseCase,
  ) {
    super();
  }

  list = async (req: Request, res: Response) => {
    const userId = (req as any).user.sub;
    const result = await this.listUC.execute(userId);
    res.json(ok(result));
  };

  getById = async (req: Request, res: Response) => {
    const userId = (req as any).user.sub;
    const result = await this.getUC.execute(req.params.id, userId);
    res.json(ok(result));
  };

  create = async (req: Request, res: Response) => {
    const schema = z.object({
      fullName: z.string().min(1),
      line1: z.string().min(1),
      line2: z.string().optional(),
      city: z.string().min(1),
      province: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().min(1),
      phone: z.string().optional(),
      metadata: z.record(z.string(), z.unknown()).optional(),
      isDefaultShipping: z.boolean().optional(),
      isDefaultBilling: z.boolean().optional(),
    });

    const input = schema.parse(req.body);
    const userId = (req as any).user.sub;

    const result = await this.createUC.execute({ ...input, userId });
    res.status(201).json(ok(result));
  };

  update = async (req: Request, res: Response) => {
    const schema = z.object({
      fullName: z.string().min(1).optional(),
      line1: z.string().min(1).optional(),
      line2: z.string().nullable().optional(),
      city: z.string().min(1).optional(),
      province: z.string().nullable().optional(),
      postalCode: z.string().nullable().optional(),
      country: z.string().min(1).optional(),
      phone: z.string().nullable().optional(),
      metadata: z.record(z.string(), z.unknown()).nullable().optional(),
      isDefaultShipping: z.boolean().optional(),
      isDefaultBilling: z.boolean().optional(),
    });

    const input = schema.parse(req.body);
    const userId = (req as any).user.sub;

    const result = await this.updateUC.execute({ id: req.params.id, userId, ...input });
    res.json(ok(result));
  };

  delete = async (req: Request, res: Response) => {
    const userId = (req as any).user.sub;
    await this.deleteUC.execute(req.params.id, userId);
    res.json(ok({}));
  };

  setDefaultShipping = async (req: Request, res: Response) => {
    const userId = (req as any).user.sub;
    await this.setDefaultUC.execute({ id: req.params.id, userId, type: 'shipping' });
    res.json(ok({}));
  };

  setDefaultBilling = async (req: Request, res: Response) => {
    const userId = (req as any).user.sub;
    await this.setDefaultUC.execute({ id: req.params.id, userId, type: 'billing' });
    res.json(ok({}));
  };
}
