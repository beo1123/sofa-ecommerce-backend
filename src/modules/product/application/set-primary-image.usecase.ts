import { ProductRepository } from '../domain/product.repository.js';
import { ProductNotFoundError } from './errors.js';

export class SetPrimaryImageUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(productId: string, imageId: string): Promise<void> {
    const prod = await this.productRepo.getProductById(productId);
    if (!prod) {
      throw new ProductNotFoundError();
    }
    await this.productRepo.setPrimaryImage(productId, imageId);
  }
}
