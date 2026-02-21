import { randomUUID } from 'crypto';
import { CategoryRepository } from '../domain/category.repository.js';
import { Category } from '../domain/category.entity.js';
import {
  CategoryAlreadyExistsError,
  CategoryNameTooShortError,
  InvalidCategorySlugError,
} from './errors.js';

export interface CreateCategoryInput {
  name: string;
  slug: string;
  image?: string;
}

export interface CreateCategoryOutput {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
    // Validate name
    if (input.name.trim().length < 2) {
      throw new CategoryNameTooShortError();
    }

    // Validate slug
    if (!this.isValidSlug(input.slug)) {
      throw new InvalidCategorySlugError();
    }

    // Check if category with same name already exists
    const existingByName = await this.categoryRepo.findByName(input.name);
    if (existingByName) {
      throw new CategoryAlreadyExistsError('name', input.name);
    }

    // Check if category with same slug already exists
    const existingBySlug = await this.categoryRepo.findBySlug(input.slug);
    if (existingBySlug) {
      throw new CategoryAlreadyExistsError('slug', input.slug);
    }

    const id = randomUUID();
    const category = new Category(
      id,
      input.name.trim(),
      input.slug.toLowerCase().trim(),
      input.image || null,
    );

    await this.categoryRepo.create(category);

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image,
    };
  }

  private isValidSlug(slug: string): boolean {
    // Slug must be lowercase, alphanumeric with hyphens only
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
  }
}
