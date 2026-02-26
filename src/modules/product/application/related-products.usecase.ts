import { ProductRepository, ProductListItem } from '../domain/product.repository.js';

export class GetRelatedProductsUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(slug: string): Promise<ProductListItem[]> {
    return this.productRepo.getRelatedProducts(slug);
  }
}
