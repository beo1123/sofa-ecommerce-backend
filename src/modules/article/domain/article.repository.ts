import { Article, ArticleCategory } from './article.entity.js';

export interface ArticleCategoryRepository {
  findById(id: string): Promise<ArticleCategory | null>;
  findBySlug(slug: string): Promise<ArticleCategory | null>;
  findByName(name: string): Promise<ArticleCategory | null>;
  create(category: ArticleCategory): Promise<void>;
  findAll(): Promise<ArticleCategory[]>;
}

export interface FindArticlesOptions {
  status?: string;
  categoryId?: string;
  limit?: number;
  offset?: number;
}

export interface ArticleRepository {
  findById(id: string): Promise<Article | null>;
  findBySlug(slug: string): Promise<Article | null>;
  create(article: Article): Promise<void>;
  update(
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
  ): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(options?: FindArticlesOptions): Promise<Article[]>;
  count(options?: Pick<FindArticlesOptions, 'status' | 'categoryId'>): Promise<number>;
}
