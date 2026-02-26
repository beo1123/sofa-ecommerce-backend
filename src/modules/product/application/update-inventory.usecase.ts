import { ProductRepository } from '../domain/product.repository.js';

export interface UpdateInventoryInput {
  quantity: number;
  reserved?: number;
}

export class UpdateInventoryUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(variantId: string, input: UpdateInventoryInput): Promise<void> {
    // we could verify variant exists but repo doesn't expose it
    await this.productRepo.updateInventory(variantId, input);
  }
}
