import { ArticleRepository } from '../domain/article.repository.js';

export interface ListArticlesInput {
  isAdmin?: boolean;
  categoryId?: string;
  limit?: number;
  offset?: number;
}

export interface ListArticlesOutput {
  items: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    thumbnail: string | null;
    status: string;
    publishedAt: Date | null;
    categoryId: string | null;
    authorId: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }>;
  total: number;
  limit: number;
  offset: number;
}

export class ListArticlesUseCase {
  constructor(private readonly articleRepo: ArticleRepository) {}

  async execute(input: ListArticlesInput = {}): Promise<ListArticlesOutput> {
    const limit = input.limit ?? 20;
    const offset = input.offset ?? 0;
    const status = input.isAdmin ? undefined : 'PUBLISHED';

    const [articles, total] = await Promise.all([
      this.articleRepo.findAll({ status, categoryId: input.categoryId, limit, offset }),
      this.articleRepo.count({ status, categoryId: input.categoryId }),
    ]);

    return {
      items: articles.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        content: a.content,
        thumbnail: a.thumbnail,
        status: a.status,
        publishedAt: a.publishedAt,
        categoryId: a.categoryId,
        authorId: a.authorId,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
      total,
      limit,
      offset,
    };
  }
}
