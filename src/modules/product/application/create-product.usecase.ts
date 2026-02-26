import { randomUUID } from 'crypto';
import { ProductRepository } from '../domain/product.repository.js';
import {
  ProductAlreadyExistsError,
  ProductTitleTooShortError,
  InvalidProductSlugError,
} from './errors.js';

export interface CreateProductInput {
  title: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  categoryId?: string;
  status?: string;
}

export interface CreateProductOutput {
  id: string;
  title: string;
  slug: string;
}

export class CreateProductUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(input: CreateProductInput): Promise<CreateProductOutput> {
    if (input.title.trim().length < 2) {
      throw new ProductTitleTooShortError();
    }

    // slugify if not provided
    const slug = input.slug ? this.normalizeSlug(input.slug) : this.slugify(input.title);
    if (!this.isValidSlug(slug)) {
      throw new InvalidProductSlugError();
    }

    const existing = await this.productRepo.getProductBySlug(slug);
    if (existing) {
      throw new ProductAlreadyExistsError('slug', slug);
    }

    const id = randomUUID();
    await this.productRepo.createProduct({
      title: input.title.trim(),
      slug,
      shortDescription: input.shortDescription,
      description: input.description,
      categoryId: input.categoryId,
      status: input.status,
    });

    return { id, title: input.title.trim(), slug };
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
