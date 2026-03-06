import { ProductRepository } from '../domain/product.repository.js';
import {
  ProductAlreadyExistsError,
  InvalidProductSlugError,
  ProductNotFoundError,
  ProductTitleTooShortError,
} from './errors.js';
import { generateSlug, isValidSlug } from './slug.util.js';

export interface UpdateProductInput {
  title?: string;
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

    let normalizedTitle: string | undefined;
    let slug: string | undefined;

    if (input.title !== undefined) {
      normalizedTitle = input.title.trim();
      if (normalizedTitle.length < 2) {
        throw new ProductTitleTooShortError();
      }

      slug = generateSlug(normalizedTitle);
      if (!isValidSlug(slug)) {
        throw new InvalidProductSlugError();
      }

      const bySlug = await this.productRepo.getProductBySlug(slug);
      if (bySlug && bySlug.id !== id) {
        throw new ProductAlreadyExistsError('slug', slug);
      }
    }

    await this.productRepo.updateProduct(id, {
      title: normalizedTitle,
      slug,
      shortDescription: input.shortDescription,
      description: input.description,
      categoryId: input.categoryId,
      status: input.status,
    });

    return {
      id,
      title: normalizedTitle ?? existing.title,
      slug: slug ?? existing.slug,
    };
  }
}
