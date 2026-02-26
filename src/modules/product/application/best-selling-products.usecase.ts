import { ProductRepository, ProductListItem } from '../domain/product.repository.js';

export class GetBestSellingProductsUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(limit: number = 8): Promise<ProductListItem[]> {
    return this.productRepo.getBestSellingProducts(limit);
  }
}
