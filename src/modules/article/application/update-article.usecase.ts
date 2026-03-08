import { ArticleRepository } from '../domain/article.repository.js';
import { ArticleNotFoundError, InvalidArticleStatusError } from './errors.js';

export interface UpdateArticleInput {
  title?: string;
  excerpt?: string | null;
  content?: string;
  thumbnail?: string | null;
  status?: 'PUBLISHED' | 'DRAFT';
  publishedAt?: Date | null;
  categoryId?: string | null;
}

export interface UpdateArticleOutput {
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

export class UpdateArticleUseCase {
  constructor(private readonly articleRepo: ArticleRepository) {}

  async execute(id: string, input: UpdateArticleInput): Promise<UpdateArticleOutput> {
    const validStatuses = ['PUBLISHED', 'DRAFT'];
    if (input.status && !validStatuses.includes(input.status)) {
      throw new InvalidArticleStatusError(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    const existing = await this.articleRepo.findById(id);
    if (!existing) {
      throw new ArticleNotFoundError();
    }

    const updateData: Parameters<ArticleRepository['update']>[1] = {};
    if (input.title !== undefined) {
      updateData.title = input.title;
      updateData.slug = this.slugify(input.title);
    }
    if (input.excerpt !== undefined) updateData.excerpt = input.excerpt;
    if (input.content !== undefined) updateData.content = input.content;
    if (input.thumbnail !== undefined) updateData.thumbnail = input.thumbnail;
    if (input.status !== undefined) {
      updateData.status = input.status;
      if (input.status === 'PUBLISHED' && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    if (input.publishedAt !== undefined) updateData.publishedAt = input.publishedAt;
    if (input.categoryId !== undefined) updateData.categoryId = input.categoryId;

    await this.articleRepo.update(id, updateData);

    const updated = await this.articleRepo.findById(id);
    if (!updated) throw new ArticleNotFoundError();

    return {
      id: updated.id,
      title: updated.title,
      slug: updated.slug,
      excerpt: updated.excerpt,
      content: updated.content,
      thumbnail: updated.thumbnail,
      status: updated.status,
      publishedAt: updated.publishedAt,
      categoryId: updated.categoryId,
      authorId: updated.authorId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
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
