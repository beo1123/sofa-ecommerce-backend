import { WishlistRepository } from '../domain/wishlist.repository.js';
import { WishlistItemNotFoundError, WishlistForbiddenError } from './errors.js';

export class RemoveItemUseCase {
  constructor(private readonly wishlistRepo: WishlistRepository) {}

  async execute(itemId: string, userId: string): Promise<void> {
    const item = await this.wishlistRepo.findItemById(itemId);
    if (!item) throw new WishlistItemNotFoundError();

    const wishlist = await this.wishlistRepo.findByUserId(userId);
    if (!wishlist || wishlist.id !== item.wishlistId) throw new WishlistForbiddenError();

    await this.wishlistRepo.removeItem(itemId);
  }
}
