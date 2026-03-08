import { ArticleCategoryRepository } from '../domain/article.repository.js';

export interface ListArticleCategoriesOutput {
  items: Array<{
    id: string;
    name: string;
    slug: string;
    createdAt?: Date;
    updatedAt?: Date;
  }>;
}

export class ListArticleCategoriesUseCase {
  constructor(private readonly categoryRepo: ArticleCategoryRepository) {}

  async execute(): Promise<ListArticleCategoriesOutput> {
    const categories = await this.categoryRepo.findAll();

    return {
      items: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
    };
  }
}
