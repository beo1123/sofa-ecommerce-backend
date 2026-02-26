import { ProductRepository } from '../domain/product.repository.js';
import { ProductNotFoundError } from './errors.js';

export class DeleteProductUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.productRepo.getProductById(id);
    if (!existing) {
      throw new ProductNotFoundError();
    }
    await this.productRepo.deleteProduct(id);
  }
}
