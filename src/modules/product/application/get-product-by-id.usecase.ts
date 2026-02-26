import { ProductRepository } from '../domain/product.repository.js';

export interface GetProductByIdOutput {
  id: string;
  title: string;
  slug: string;
  status: string;
}

export class GetProductByIdUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(id: string): Promise<GetProductByIdOutput | null> {
    const p = await this.productRepo.getProductById(id);
    if (!p) return null;
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      status: p.status,
    };
  }
}
