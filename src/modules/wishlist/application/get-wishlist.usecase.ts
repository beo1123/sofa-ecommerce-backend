import { randomUUID } from 'crypto';
import { WishlistRepository } from '../domain/wishlist.repository.js';
import { Wishlist } from '../domain/wishlist.entity.js';

export interface GetWishlistOutput {
  id: string;
  userId: string;
  items: Array<{
    id: string;
    wishlistId: string;
    productId: string;
    variantId: string | null;
    createdAt?: Date;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

export class GetWishlistUseCase {
  constructor(private readonly wishlistRepo: WishlistRepository) {}

  async execute(userId: string): Promise<GetWishlistOutput> {
    let wishlist = await this.wishlistRepo.findByUserId(userId);

    if (!wishlist) {
      const newWishlist = Wishlist.create({ id: randomUUID(), userId, items: [] });
      await this.wishlistRepo.createWishlist(newWishlist);
      wishlist = newWishlist;
    }

    return {
      id: wishlist.id,
      userId: wishlist.userId,
      items: wishlist.items.map((item) => ({
        id: item.id,
        wishlistId: item.wishlistId,
        productId: item.productId,
        variantId: item.variantId,
        createdAt: item.createdAt,
      })),
      createdAt: wishlist.createdAt,
      updatedAt: wishlist.updatedAt,
    };
  }
}
