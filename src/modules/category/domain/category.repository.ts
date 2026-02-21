import { Category } from './category.entity.js';

export interface CategoryRepository {
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  create(category: Category): Promise<void>;
  update(id: string, data: { name?: string; slug?: string; image?: string }): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(limit?: number, offset?: number): Promise<Category[]>;
  count(): Promise<number>;
}
