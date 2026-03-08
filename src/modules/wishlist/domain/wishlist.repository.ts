import { Wishlist, WishlistItem } from './wishlist.entity.js';

export interface WishlistRepository {
  findByUserId(userId: string): Promise<Wishlist | null>;
  createWishlist(wishlist: Wishlist): Promise<void>;
  findItemById(itemId: string): Promise<WishlistItem | null>;
  findItemByProductAndVariant(
    wishlistId: string,
    productId: string,
    variantId: string | null,
  ): Promise<WishlistItem | null>;
  addItem(item: WishlistItem): Promise<void>;
  removeItem(itemId: string): Promise<void>;
  clearItems(wishlistId: string): Promise<void>;
}
