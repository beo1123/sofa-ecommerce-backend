import { ProductRepository } from '../domain/product.repository.js';

export interface UpdateVariantInput {
  name?: string;
  price?: number;
  compareAtPrice?: number;
  image?: string;
  colorCode?: string;
  colorName?: string;
  material?: string;
}

export class UpdateVariantUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(id: string, input: UpdateVariantInput): Promise<void> {
    // optionally verify variant exist; repository doesn't provide find by id
    await this.productRepo.updateVariant(id, input);
  }
}
