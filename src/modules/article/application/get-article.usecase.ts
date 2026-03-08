import { ArticleRepository } from '../domain/article.repository.js';
import { ArticleNotFoundError } from './errors.js';

export interface GetArticleOutput {
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
}

export class GetArticleUseCase {
  constructor(private readonly articleRepo: ArticleRepository) {}

  async execute(id: string): Promise<GetArticleOutput> {
    const article = await this.articleRepo.findById(id);
    if (!article) {
      throw new ArticleNotFoundError();
    }

    return {
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
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    };
  }

  async executeBySlug(slug: string): Promise<GetArticleOutput> {
    const article = await this.articleRepo.findBySlug(slug);
    if (!article) {
      throw new ArticleNotFoundError();
    }

    return {
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
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    };
  }
}
