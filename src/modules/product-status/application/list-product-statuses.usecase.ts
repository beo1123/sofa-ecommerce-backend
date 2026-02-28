import { ProductRepository } from '../../product/domain/product.repository.js';
import { ProductStatus } from '../../product/domain/product-status.entity.js';

export class ListProductStatusesUseCase {
  constructor(private readonly repo: ProductRepository) {}

  async execute(): Promise<ProductStatus[]> {
    return this.repo.listStatuses();
  }
}
