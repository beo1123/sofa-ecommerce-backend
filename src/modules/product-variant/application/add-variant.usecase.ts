import { randomUUID } from 'crypto';
import { ProductRepository } from '../../product/domain/product.repository.js';
import { ProductNotFoundError } from './errors.js';

export interface AddVariantInput {
  productId: string;
  name: string;
  skuPrefix?: string;
  colorCode?: string;
  colorName?: string;
  material?: string;
  price: number;
  compareAtPrice?: number;
  image?: string;
}

export interface AddVariantOutput {
  id: string;
}

export class AddVariantUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(input: AddVariantInput): Promise<AddVariantOutput> {
    const prod = await this.productRepo.getProductById(input.productId);
    if (!prod) {
      throw new ProductNotFoundError();
    }
    const id = randomUUID();
    await this.productRepo.addVariant(input.productId, {
      name: input.name,
      skuPrefix: input.skuPrefix,
      colorCode: input.colorCode,
      colorName: input.colorName,
      material: input.material,
      price: input.price,
      compareAtPrice: input.compareAtPrice,
      image: input.image,
    });
    return { id };
  }
}
