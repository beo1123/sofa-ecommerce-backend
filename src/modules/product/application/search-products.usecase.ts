import {
  ProductRepository,
  ProductSearchQuery,
  ProductListItem,
} from '../domain/product.repository.js';

export interface SearchProductsInput extends ProductSearchQuery {}

export interface SearchProductsOutput {
  items: ProductListItem[];
  total: number;
  page: number;
  perPage: number;
}

export class SearchProductsUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(input: SearchProductsInput): Promise<SearchProductsOutput> {
    const { page, limit } = input;
    const result = await this.productRepo.searchProducts(input);
    return {
      items: result.items,
      total: result.total,
      page,
      perPage: limit,
    };
  }
}
