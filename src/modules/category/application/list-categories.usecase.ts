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
  page: number;
  perPage: number;
}

export class ListCategoriesUseCase {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  async execute(page: number = 1, perPage: number = 20): Promise<ListCategoriesOutput> {
    const offset = (page - 1) * perPage;
    const [categories, total] = await Promise.all([
      this.categoryRepo.findAll(perPage, offset),
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
      page,
      perPage,
    };
  }
}
