import { ProductRepository } from '../../product/domain/product.repository.js';

export class RemoveProductImageUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(imageId: string): Promise<void> {
    // no need to look up product by id; repo will just delete
    await this.productRepo.removeProductImage(imageId);
  }
}
