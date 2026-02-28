import { randomUUID } from 'crypto';
import { ProductRepository } from '../../product/domain/product.repository.js';
import { ProductNotFoundError } from './errors.js';

export interface AddProductImageInput {
  productId: string;
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface AddProductImageOutput {
  id: string;
}

export class AddProductImageUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(input: AddProductImageInput): Promise<AddProductImageOutput> {
    const prod = await this.productRepo.getProductById(input.productId);
    if (!prod) {
      throw new ProductNotFoundError();
    }
    const id = randomUUID();
    await this.productRepo.addProductImage(input.productId, {
      url: input.url,
      alt: input.alt,
      isPrimary: input.isPrimary,
    });
    return { id };
  }
}
