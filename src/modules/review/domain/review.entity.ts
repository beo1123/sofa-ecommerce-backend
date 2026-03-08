export class Review {
  constructor(
    public readonly id: string,
    public readonly userId: string | null,
    public readonly productId: string,
    public readonly rating: number,
    public readonly title: string | null,
    public readonly body: string | null,
    public readonly approved: boolean,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(data: {
    id: string;
    userId?: string | null;
    productId: string;
    rating: number;
    title?: string | null;
    body?: string | null;
    approved?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }): Review {
    return new Review(
      data.id,
      data.userId ?? null,
      data.productId,
      data.rating,
      data.title ?? null,
      data.body ?? null,
      data.approved ?? false,
      data.createdAt,
      data.updatedAt,
    );
  }
}
