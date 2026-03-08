import { randomUUID } from 'crypto';
import { ArticleRepository } from '../domain/article.repository.js';
import { Article } from '../domain/article.entity.js';
import { ArticleAlreadyExistsError, InvalidArticleStatusError } from './errors.js';

export interface CreateArticleInput {
  title: string;
  excerpt?: string | null;
  content: string;
  thumbnail?: string | null;
  status?: 'PUBLISHED' | 'DRAFT';
  publishedAt?: Date | null;
  categoryId?: string | null;
  authorId?: string | null;
}

export interface CreateArticleOutput {
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

export class CreateArticleUseCase {
  constructor(private readonly articleRepo: ArticleRepository) {}

  async execute(input: CreateArticleInput): Promise<CreateArticleOutput> {
    const validStatuses = ['PUBLISHED', 'DRAFT'];
    if (input.status && !validStatuses.includes(input.status)) {
      throw new InvalidArticleStatusError(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    const slug = this.slugify(input.title);

    const existing = await this.articleRepo.findBySlug(slug);
    if (existing) {
      throw new ArticleAlreadyExistsError('slug', slug);
    }

    const article = Article.create({
      id: randomUUID(),
      title: input.title,
      slug,
      excerpt: input.excerpt ?? null,
      content: input.content,
      thumbnail: input.thumbnail ?? null,
      status: input.status ?? 'PUBLISHED',
      publishedAt: input.publishedAt ?? (input.status !== 'DRAFT' ? new Date() : null),
      categoryId: input.categoryId ?? null,
      authorId: input.authorId ?? null,
    });

    await this.articleRepo.create(article);

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

  private slugify(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
