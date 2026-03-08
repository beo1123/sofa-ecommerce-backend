import { randomUUID } from 'crypto';
import { WishlistRepository } from '../domain/wishlist.repository.js';
import { Wishlist, WishlistItem } from '../domain/wishlist.entity.js';
import { WishlistItemAlreadyExistsError } from './errors.js';

export interface AddItemInput {
  userId: string;
  productId: string;
  variantId?: string;
}

export interface AddItemOutput {
  id: string;
  wishlistId: string;
  productId: string;
  variantId: string | null;
  createdAt?: Date;
}

export class AddItemUseCase {
  constructor(private readonly wishlistRepo: WishlistRepository) {}

  async execute(input: AddItemInput): Promise<AddItemOutput> {
    let wishlist = await this.wishlistRepo.findByUserId(input.userId);
    if (!wishlist) {
      const newWishlist = Wishlist.create({ id: randomUUID(), userId: input.userId, items: [] });
      await this.wishlistRepo.createWishlist(newWishlist);
      wishlist = newWishlist;
    }

    const variantId = input.variantId ?? null;
    const existing = await this.wishlistRepo.findItemByProductAndVariant(
      wishlist.id,
      input.productId,
      variantId,
    );
    if (existing) throw new WishlistItemAlreadyExistsError();

    const item = WishlistItem.create({
      id: randomUUID(),
      wishlistId: wishlist.id,
      productId: input.productId,
      variantId,
    });

    await this.wishlistRepo.addItem(item);

    return {
      id: item.id,
      wishlistId: item.wishlistId,
      productId: item.productId,
      variantId: item.variantId,
      createdAt: item.createdAt,
    };
  }
}
