import { CategoryRepository } from '../domain/category.repository.js';

export interface ListCategoriesOutput {
  items: Array<{
    id: string;
    name: string;
    slug: string;
    image: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }>;
  total: number;
  limit: number;
  offset: number;
}

export class ListCategoriesUseCase {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  async execute(limit: number = 20, offset: number = 0): Promise<ListCategoriesOutput> {
    const [categories, total] = await Promise.all([
      this.categoryRepo.findAll(limit, offset),
      this.categoryRepo.count(),
    ]);

    return {
      items: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        image: c.image,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
      total,
      limit,
      offset,
    };
  }
}
