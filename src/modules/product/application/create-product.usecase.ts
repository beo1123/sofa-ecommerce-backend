import { ProductRepository } from '../domain/product.repository.js';
import {
  ProductAlreadyExistsError,
  ProductTitleTooShortError,
  InvalidProductSlugError,
} from './errors.js';
import { generateSlug, isValidSlug } from './slug.util.js';

export interface CreateProductInput {
  title: string;
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
    const normalizedTitle = input.title.trim();
    if (normalizedTitle.length < 2) {
      throw new ProductTitleTooShortError();
    }

    const slug = generateSlug(normalizedTitle);
    if (!isValidSlug(slug)) {
      throw new InvalidProductSlugError();
    }

    const existing = await this.productRepo.getProductBySlug(slug);
    if (existing) {
      throw new ProductAlreadyExistsError('slug', slug);
    }

    const id = await this.productRepo.createProduct({
      title: normalizedTitle,
      slug,
      shortDescription: input.shortDescription,
      description: input.description,
      categoryId: input.categoryId,
      status: input.status,
    });

    return { id, title: normalizedTitle, slug };
  }
}
