/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq, and } from 'drizzle-orm';
import { db } from '../../../shared/db/pg.js';
import { articles, articleCategories } from '../../../shared/db/schema.js';
import {
  ArticleCategoryRepository,
  ArticleRepository,
  FindArticlesOptions,
} from '../domain/article.repository.js';
import { Article, ArticleCategory } from '../domain/article.entity.js';

export class PgArticleCategoryRepository implements ArticleCategoryRepository {
  async findById(id: string): Promise<ArticleCategory | null> {
    const rows = await db
      .select()
      .from(articleCategories)
      .where(eq(articleCategories.id, id))
      .limit(1);
    if (!rows.length) return null;
    const r = rows[0];
    return ArticleCategory.create({
      id: r.id,
      name: r.name,
      slug: r.slug,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    });
  }

  async findBySlug(slug: string): Promise<ArticleCategory | null> {
    const rows = await db
      .select()
      .from(articleCategories)
      .where(eq(articleCategories.slug, slug))
      .limit(1);
    if (!rows.length) return null;
    const r = rows[0];
    return ArticleCategory.create({
      id: r.id,
      name: r.name,
      slug: r.slug,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    });
  }

  async findByName(name: string): Promise<ArticleCategory | null> {
    const rows = await db
      .select()
      .from(articleCategories)
      .where(eq(articleCategories.name, name))
      .limit(1);
    if (!rows.length) return null;
    const r = rows[0];
    return ArticleCategory.create({
      id: r.id,
      name: r.name,
      slug: r.slug,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    });
  }

  async create(category: ArticleCategory): Promise<void> {
    await db.insert(articleCategories).values({
      id: category.id,
      name: category.name,
      slug: category.slug,
    });
  }

  async findAll(): Promise<ArticleCategory[]> {
    const rows = await db.select().from(articleCategories);
    return rows.map((r) =>
      ArticleCategory.create({
        id: r.id,
        name: r.name,
        slug: r.slug,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      }),
    );
  }
}

export class PgArticleRepository implements ArticleRepository {
  async findById(id: string): Promise<Article | null> {
    const rows = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
    if (!rows.length) return null;
    return this.toEntity(rows[0]);
  }

  async findBySlug(slug: string): Promise<Article | null> {
    const rows = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
    if (!rows.length) return null;
    return this.toEntity(rows[0]);
  }

  async create(article: Article): Promise<void> {
    await db.insert(articles).values({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      thumbnail: article.thumbnail,
      status: article.status,
      publishedAt: article.publishedAt,
      categoryId: article.categoryId,
      authorId: article.authorId,
    });
  }

  async update(
    id: string,
    data: Partial<{
      title: string;
      slug: string;
      excerpt: string | null;
      content: string;
      thumbnail: string | null;
      status: string;
      publishedAt: Date | null;
      categoryId: string | null;
    }>,
  ): Promise<void> {
    const updateData: any = { ...data, updatedAt: new Date() };
    await db.update(articles).set(updateData).where(eq(articles.id, id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(articles).where(eq(articles.id, id));
  }

  async findAll(options?: FindArticlesOptions): Promise<Article[]> {
    const conditions = this.buildConditions(options);
    let query: any = db.select().from(articles);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    if (options?.limit !== undefined) query = query.limit(options.limit);
    if (options?.offset !== undefined) query = query.offset(options.offset);

    const rows = await query;
    return rows.map((r: any) => this.toEntity(r));
  }

  async count(options?: Pick<FindArticlesOptions, 'status' | 'categoryId'>): Promise<number> {
    const conditions = this.buildConditions(options);
    let query: any = db.select().from(articles);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const rows = await query;
    return rows.length;
  }

  private buildConditions(options?: Pick<FindArticlesOptions, 'status' | 'categoryId'>): any[] {
    const conditions: any[] = [];
    if (options?.status) conditions.push(eq(articles.status, options.status));
    if (options?.categoryId) conditions.push(eq(articles.categoryId, options.categoryId));
    return conditions;
  }

  private toEntity(r: any): Article {
    return Article.create({
      id: r.id,
      title: r.title,
      slug: r.slug,
      excerpt: r.excerpt,
      content: r.content,
      thumbnail: r.thumbnail,
      status: r.status,
      publishedAt: r.publishedAt,
      categoryId: r.categoryId,
      authorId: r.authorId,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    });
  }
}
