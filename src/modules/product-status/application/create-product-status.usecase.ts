import { ProductRepository } from '../../product/domain/product.repository.js';

export class CreateProductStatusUseCase {
  constructor(private readonly repo: ProductRepository) {}

  async execute(name: string, description?: string): Promise<void> {
    if (!name || name.trim().length === 0) throw new Error('status name required');
    await this.repo.createStatus(name.trim(), description);
  }
}
