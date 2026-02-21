export class Category {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly image: string | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  /**
   * Helper method to create a new Category
   */
  static create(data: {
    id: string;
    name: string;
    slug: string;
    image?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): Category {
    return new Category(
      data.id,
      data.name,
      data.slug,
      data.image || null,
      data.createdAt,
      data.updatedAt,
    );
  }
}
