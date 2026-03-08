import { randomUUID } from 'crypto';
import { WishlistRepository } from '../domain/wishlist.repository.js';
import { Wishlist } from '../domain/wishlist.entity.js';

export class ClearWishlistUseCase {
  constructor(private readonly wishlistRepo: WishlistRepository) {}

  async execute(userId: string): Promise<void> {
    const wishlist = await this.wishlistRepo.findByUserId(userId);
    if (!wishlist) {
      const newWishlist = Wishlist.create({ id: randomUUID(), userId, items: [] });
      await this.wishlistRepo.createWishlist(newWishlist);
      return;
    }
    await this.wishlistRepo.clearItems(wishlist.id);
  }
}
