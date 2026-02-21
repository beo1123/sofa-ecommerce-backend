import { CategoryRepository } from '../domain/category.repository.js';
import { CategoryNotFoundError } from './errors.js';

export interface GetCategoryOutput {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class GetCategoryUseCase {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  async execute(id: string): Promise<GetCategoryOutput> {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new CategoryNotFoundError();
    }

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  async executeBySlug(slug: string): Promise<GetCategoryOutput> {
    const category = await this.categoryRepo.findBySlug(slug);
    if (!category) {
      throw new CategoryNotFoundError();
    }

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
