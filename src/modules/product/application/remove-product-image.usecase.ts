import { ProductRepository } from '../domain/product.repository.js';

export class RemoveProductImageUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(imageId: string): Promise<void> {
    // we could optionally verify the image exists but repo doesn't expose
    await this.productRepo.removeProductImage(imageId);
  }
}
