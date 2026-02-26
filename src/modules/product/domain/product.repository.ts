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

export type VariantInventoryItem = {
  sku: string;
  quantity: number;
  reserved: number;
};

export type ProductListItem = {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  priceMin: number | null;
  priceMax: number | null;
  primaryImage: { url: string; alt: string | null } | null;
  variantsCount: number;
  category: { name: string; slug: string } | null;
  variants: Array<{
    id: string;
    skuPrefix: string | null;
    inventory?: VariantInventoryItem[];
    price: number;
  }>;
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

  // fetch by primary key id
  getProductById(id: string): Promise<Product | null>;

  // additional read helpers used by storefront
  getRelatedProducts(slug: string): Promise<ProductListItem[]>;
  getBestSellingProducts(limit: number): Promise<ProductListItem[]>;
  getFeaturedProducts(limit: number): Promise<ProductListItem[]>;
  getFilters(): Promise<{
    materials: string[];
    colors: string[];
    priceMin: number;
    priceMax: number;
  }>;

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
