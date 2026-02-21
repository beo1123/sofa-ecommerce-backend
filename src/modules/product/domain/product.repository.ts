import { Category } from './category.entity.js';
import { Product } from './product.entity.js';

export type ProductSearchQuery = {
  q?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  material?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest';
  page: number;
  limit: number;
};

export type ProductListItem = {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  priceFrom: number;
};

export interface ProductRepository {
  // ───── Category ─────
  listCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | null>;
  createCategory(input: { name: string; slug: string; image?: string }): Promise<string>;
  updateCategory(
    id: string,
    input: { name?: string; slug?: string; image?: string },
  ): Promise<void>;
  deleteCategory(id: string): Promise<void>;

  // ───── Public Product ─────
  searchProducts(query: ProductSearchQuery): Promise<{ items: ProductListItem[]; total: number }>;

  getProductBySlug(slug: string): Promise<Product | null>;

  // ───── Admin Product ─────
  createProduct(input: {
    title: string;
    slug: string;
    shortDescription?: string;
    description?: string;
    categoryId?: string;
    status?: string;
  }): Promise<string>;

  updateProduct(
    id: string,
    input: {
      title?: string;
      slug?: string;
      shortDescription?: string;
      description?: string;
      categoryId?: string;
      status?: string;
    },
  ): Promise<void>;

  deleteProduct(id: string): Promise<void>;

  // ───── Images ─────
  addProductImage(
    productId: string,
    input: { url: string; alt?: string; isPrimary?: boolean },
  ): Promise<string>;
  removeProductImage(imageId: string): Promise<void>;
  setPrimaryImage(productId: string, imageId: string): Promise<void>;

  // ───── Variants & Inventory ─────
  addVariant(
    productId: string,
    input: {
      name: string;
      skuPrefix?: string;
      colorCode?: string;
      colorName?: string;
      material?: string;
      price: number;
      compareAtPrice?: number;
      image?: string;
    },
  ): Promise<string>;

  updateVariant(
    id: string,
    input: {
      name?: string;
      price?: number;
      compareAtPrice?: number;
      image?: string;
      colorCode?: string;
      colorName?: string;
      material?: string;
    },
  ): Promise<void>;

  updateInventory(variantId: string, input: { quantity: number; reserved?: number }): Promise<void>;
}
