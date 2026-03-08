import { Router } from 'express';
import { requireAuth } from '../../../shared/auth/auth.middleware.js';
import { PgAddressRepository } from '../infrastructure/address.repo.pg.js';
import { CreateAddressUseCase } from '../application/create-address.usecase.js';
import { UpdateAddressUseCase } from '../application/update-address.usecase.js';
import { DeleteAddressUseCase } from '../application/delete-address.usecase.js';
import { ListAddressesUseCase } from '../application/list-addresses.usecase.js';
import { GetAddressUseCase } from '../application/get-address.usecase.js';
import { SetDefaultAddressUseCase } from '../application/set-default-address.usecase.js';
import { AddressController } from './address.controller.js';

export function createAddressRouter(): Router {
  const repo = new PgAddressRepository();

  const createUC = new CreateAddressUseCase(repo);
  const updateUC = new UpdateAddressUseCase(repo);
  const deleteUC = new DeleteAddressUseCase(repo);
  const listUC = new ListAddressesUseCase(repo);
  const getUC = new GetAddressUseCase(repo);
  const setDefaultUC = new SetDefaultAddressUseCase(repo);

  const controller = new AddressController(
    createUC,
    updateUC,
    deleteUC,
    listUC,
    getUC,
    setDefaultUC,
  );

  const r = Router();

  r.use(requireAuth);

  r.get('/', controller.handle(controller.list));
  r.get('/:id', controller.handle(controller.getById));
  r.post('/', controller.handle(controller.create));
  r.patch('/:id', controller.handle(controller.update));
  r.delete('/:id', controller.handle(controller.delete));
  r.patch('/:id/default-shipping', controller.handle(controller.setDefaultShipping));
  r.patch('/:id/default-billing', controller.handle(controller.setDefaultBilling));

  return r;
}
