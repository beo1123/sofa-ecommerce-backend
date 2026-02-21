/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq } from 'drizzle-orm';
import { db } from '../../../shared/db/pg.js';
import { categories } from '../../../shared/db/schema.js';
import { CategoryRepository } from '../domain/category.repository.js';
import { Category } from '../domain/category.entity.js';

export class PgCategoryRepository implements CategoryRepository {
  async findById(id: string): Promise<Category | null> {
    const row = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    if (!row.length) return null;

    const r = row[0];
    return Category.create({
      id: r.id,
      name: r.name,
      slug: r.slug,
      image: r.image,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const row = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    if (!row.length) return null;

    const r = row[0];
    return Category.create({
      id: r.id,
      name: r.name,
      slug: r.slug,
      image: r.image,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    });
  }

  async findByName(name: string): Promise<Category | null> {
    const row = await db.select().from(categories).where(eq(categories.name, name)).limit(1);
    if (!row.length) return null;

    const r = row[0];
    return Category.create({
      id: r.id,
      name: r.name,
      slug: r.slug,
      image: r.image,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    });
  }

  async create(category: Category): Promise<void> {
    await db.insert(categories).values({
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image,
    });
  }

  async update(id: string, data: { name?: string; slug?: string; image?: string }): Promise<void> {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.image !== undefined) updateData.image = data.image;

    if (Object.keys(updateData).length === 0) return;

    await db.update(categories).set(updateData).where(eq(categories.id, id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  async findAll(limit?: number, offset?: number): Promise<Category[]> {
    let query: any = db.select().from(categories);

    if (limit !== undefined) {
      query = query.limit(limit);
    }
    if (offset !== undefined) {
      query = query.offset(offset);
    }

    const rows = await query;
    return rows.map(
      (r: any) => new Category(r.id, r.name, r.slug, r.image, r.createdAt, r.updatedAt),
    );
  }

  async count(): Promise<number> {
    const result = await db.select().from(categories);
    return result.length;
  }
}
