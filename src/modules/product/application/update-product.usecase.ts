import { ProductRepository } from '../domain/product.repository.js';
import {
  ProductAlreadyExistsError,
  InvalidProductSlugError,
  ProductNotFoundError,
  ProductTitleTooShortError,
} from './errors.js';

export interface UpdateProductInput {
  title?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  categoryId?: string;
  status?: string;
}

export interface UpdateProductOutput {
  id: string;
  title: string;
  slug: string;
}

export class UpdateProductUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(id: string, input: UpdateProductInput): Promise<UpdateProductOutput> {
    const existing = await this.productRepo.getProductById(id);
    if (!existing) {
      throw new ProductNotFoundError();
    }

    let slug: string | undefined;
    if (input.slug !== undefined || input.title !== undefined) {
      if (input.slug) {
        slug = this.normalizeSlug(input.slug);
      } else if (input.title) {
        slug = this.slugify(input.title);
      }
      if (slug && !this.isValidSlug(slug)) {
        throw new InvalidProductSlugError();
      }
      if (slug) {
        const bySlug = await this.productRepo.getProductBySlug(slug);
        if (bySlug && bySlug.id !== id) {
          throw new ProductAlreadyExistsError('slug', slug);
        }
      }
    }

    if (input.title && input.title.trim().length < 2) {
      throw new ProductTitleTooShortError();
    }

    await this.productRepo.updateProduct(id, {
      title: input.title,
      slug,
      shortDescription: input.shortDescription,
      description: input.description,
      categoryId: input.categoryId,
      status: input.status,
    });

    return {
      id,
      title: input.title ?? existing.title,
      slug: slug ?? existing.slug,
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
