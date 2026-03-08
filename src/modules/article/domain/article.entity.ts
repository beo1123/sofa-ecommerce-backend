import { randomUUID } from 'crypto';

export class ArticleCategory {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(data: {
    id?: string;
    name: string;
    slug: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): ArticleCategory {
    return new ArticleCategory(
      data.id ?? randomUUID(),
      data.name,
      data.slug,
      data.createdAt,
      data.updatedAt,
    );
  }
}

export class Article {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly slug: string,
    public readonly excerpt: string | null,
    public readonly content: string,
    public readonly thumbnail: string | null,
    public readonly status: string,
    public readonly publishedAt: Date | null,
    public readonly categoryId: string | null,
    public readonly authorId: string | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(data: {
    id?: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    thumbnail?: string | null;
    status?: string;
    publishedAt?: Date | null;
    categoryId?: string | null;
    authorId?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): Article {
    return new Article(
      data.id ?? randomUUID(),
      data.title,
      data.slug,
      data.excerpt ?? null,
      data.content,
      data.thumbnail ?? null,
      data.status ?? 'PUBLISHED',
      data.publishedAt ?? null,
      data.categoryId ?? null,
      data.authorId ?? null,
      data.createdAt,
      data.updatedAt,
    );
  }
}
