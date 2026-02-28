import { ProductRepository } from '../../product/domain/product.repository.js';

export interface UpdateInventoryInput {
  quantity: number;
  reserved?: number;
}

export class UpdateInventoryUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(variantId: string, input: UpdateInventoryInput): Promise<void> {
    await this.productRepo.updateInventory(variantId, input);
  }
}
