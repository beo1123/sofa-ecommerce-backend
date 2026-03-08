import { Router } from 'express';
import { PgWishlistRepository } from '../infrastructure/wishlist.repo.pg.js';
import { GetWishlistUseCase } from '../application/get-wishlist.usecase.js';
import { AddItemUseCase } from '../application/add-item.usecase.js';
import { RemoveItemUseCase } from '../application/remove-item.usecase.js';
import { ClearWishlistUseCase } from '../application/clear-wishlist.usecase.js';
import { WishlistController } from './wishlist.controller.js';
import { requireAuth } from '../../../shared/auth/auth.middleware.js';

export function createWishlistRouter(): Router {
  const wishlistRepo = new PgWishlistRepository();
  const getUC = new GetWishlistUseCase(wishlistRepo);
  const addItemUC = new AddItemUseCase(wishlistRepo);
  const removeItemUC = new RemoveItemUseCase(wishlistRepo);
  const clearUC = new ClearWishlistUseCase(wishlistRepo);
  const controller = new WishlistController(getUC, addItemUC, removeItemUC, clearUC);

  const r = Router();

  r.use(requireAuth);

  r.get('/', controller.handle(controller.get));
  r.post('/items', controller.handle(controller.addItem));
  r.delete('/items/:itemId', controller.handle(controller.removeItem));
  r.delete('/', controller.handle(controller.clear));

  return r;
}
