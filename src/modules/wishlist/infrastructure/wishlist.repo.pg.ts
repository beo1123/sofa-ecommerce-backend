/* eslint-disable @typescript-eslint/no-explicit-any */
import { and, eq, isNull } from 'drizzle-orm';
import { db } from '../../../shared/db/pg.js';
import { wishlists, wishlistItems } from '../../../shared/db/schema.js';
import { WishlistRepository } from '../domain/wishlist.repository.js';
import { Wishlist, WishlistItem } from '../domain/wishlist.entity.js';

export class PgWishlistRepository implements WishlistRepository {
  async findByUserId(userId: string): Promise<Wishlist | null> {
    const rows = await db.select().from(wishlists).where(eq(wishlists.userId, userId)).limit(1);
    if (!rows.length) return null;

    const w = rows[0];
    const items = await db.select().from(wishlistItems).where(eq(wishlistItems.wishlistId, w.id));

    return Wishlist.create({
      id: w.id,
      userId: w.userId,
      items: items.map((i) =>
        WishlistItem.create({
          id: i.id,
          wishlistId: i.wishlistId,
          productId: i.productId,
          variantId: i.variantId,
          createdAt: i.createdAt,
        }),
      ),
      createdAt: w.createdAt,
      updatedAt: w.updatedAt,
    });
  }

  async createWishlist(wishlist: Wishlist): Promise<void> {
    await db.insert(wishlists).values({
      id: wishlist.id,
      userId: wishlist.userId,
    });
  }

  async findItemById(itemId: string): Promise<WishlistItem | null> {
    const rows = await db.select().from(wishlistItems).where(eq(wishlistItems.id, itemId)).limit(1);
    if (!rows.length) return null;
    const i = rows[0];
    return WishlistItem.create({
      id: i.id,
      wishlistId: i.wishlistId,
      productId: i.productId,
      variantId: i.variantId,
      createdAt: i.createdAt,
    });
  }

  async findItemByProductAndVariant(
    wishlistId: string,
    productId: string,
    variantId: string | null,
  ): Promise<WishlistItem | null> {
    const condition = variantId
      ? and(
          eq(wishlistItems.wishlistId, wishlistId),
          eq(wishlistItems.productId, productId),
          eq(wishlistItems.variantId, variantId),
        )
      : and(
          eq(wishlistItems.wishlistId, wishlistId),
          eq(wishlistItems.productId, productId),
          isNull(wishlistItems.variantId),
        );

    const rows = await db.select().from(wishlistItems).where(condition).limit(1);
    if (!rows.length) return null;
    const i = rows[0];
    return WishlistItem.create({
      id: i.id,
      wishlistId: i.wishlistId,
      productId: i.productId,
      variantId: i.variantId,
      createdAt: i.createdAt,
    });
  }

  async addItem(item: WishlistItem): Promise<void> {
    await db.insert(wishlistItems).values({
      id: item.id,
      wishlistId: item.wishlistId,
      productId: item.productId,
      variantId: item.variantId ?? undefined,
    });
  }

  async removeItem(itemId: string): Promise<void> {
    await db.delete(wishlistItems).where(eq(wishlistItems.id, itemId));
  }

  async clearItems(wishlistId: string): Promise<void> {
    await db.delete(wishlistItems).where(eq(wishlistItems.wishlistId, wishlistId));
  }
}
