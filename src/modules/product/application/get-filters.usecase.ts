import { ProductRepository } from '../domain/product.repository.js';

export interface FiltersOutput {
  materials: string[];
  colors: string[];
  priceMin: number;
  priceMax: number;
}

export class GetFiltersUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(): Promise<FiltersOutput> {
    return this.productRepo.getFilters();
  }
}
