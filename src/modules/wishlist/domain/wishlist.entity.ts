export class WishlistItem {
  constructor(
    public readonly id: string,
    public readonly wishlistId: string,
    public readonly productId: string,
    public readonly variantId: string | null,
    public readonly createdAt?: Date,
  ) {}

  static create(data: {
    id: string;
    wishlistId: string;
    productId: string;
    variantId?: string | null;
    createdAt?: Date;
  }): WishlistItem {
    return new WishlistItem(
      data.id,
      data.wishlistId,
      data.productId,
      data.variantId ?? null,
      data.createdAt,
    );
  }
}

export class Wishlist {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly items: WishlistItem[],
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(data: {
    id: string;
    userId: string;
    items?: WishlistItem[];
    createdAt?: Date;
    updatedAt?: Date;
  }): Wishlist {
    return new Wishlist(data.id, data.userId, data.items ?? [], data.createdAt, data.updatedAt);
  }
}
