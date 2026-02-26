import { ProductRepository } from '../domain/product.repository.js';

export interface GetProductBySlugOutput {
  // reuse whatever the repository returns (domain Product) or extend as needed
  id: string;
  title: string;
  slug: string;
  status: string;
}

export class GetProductBySlugUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(slug: string): Promise<GetProductBySlugOutput | null> {
    const p = await this.productRepo.getProductBySlug(slug);
    if (!p) return null;
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      status: p.status,
    };
  }
}
