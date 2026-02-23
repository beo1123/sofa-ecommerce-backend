/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategoryRepository } from '../domain/category.repository.js';
import {
  CategoryNotFoundError,
  CategoryAlreadyExistsError,
  CategoryNameTooShortError,
  InvalidCategorySlugError,
} from './errors.js';

export interface UpdateCategoryInput {
  name?: string;
  image?: string;
}

export interface UpdateCategoryOutput {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  async execute(id: string, input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
    // Check if category exists
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new CategoryNotFoundError();
    }

    const updateData: any = {};

    // Validate and update name if provided
    if (input.name !== undefined) {
      if (input.name.trim().length < 2) {
        throw new CategoryNameTooShortError();
      }
      const trimmedName = input.name.trim();
      // Check if another category has this name
      if (trimmedName !== category.name) {
        const existing = await this.categoryRepo.findByName(trimmedName);
        if (existing) {
          throw new CategoryAlreadyExistsError('name', trimmedName);
        }
      }
      updateData.name = trimmedName;

      // Auto-generate new slug from updated name
      const newSlug = this.slugify(trimmedName);
      if (!this.isValidSlug(newSlug)) {
        throw new InvalidCategorySlugError();
      }
      // Check if another category has this slug
      if (newSlug !== category.slug) {
        const existing = await this.categoryRepo.findBySlug(newSlug);
        if (existing) {
          throw new CategoryAlreadyExistsError('slug', newSlug);
        }
      }
      updateData.slug = newSlug;
    }

    // Update image if provided
    if (input.image !== undefined) {
      updateData.image = input.image || null;
    }

    if (Object.keys(updateData).length === 0) {
      // No changes to make, return current category
      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        image: category.image,
      };
    }

    await this.categoryRepo.update(id, updateData);

    // Return updated category
    const updated = await this.categoryRepo.findById(id);
    if (!updated) {
      throw new CategoryNotFoundError();
    }

    return {
      id: updated.id,
      name: updated.name,
      slug: updated.slug,
      image: updated.image,
    };
  }

  private isValidSlug(slug: string): boolean {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
  }

  private normalizeSlug(slug: string): string {
    return slug
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private slugify(name: string): string {
    return this.normalizeSlug(name);
  }
}
