import { randomUUID } from 'crypto';
import { ArticleCategoryRepository } from '../domain/article.repository.js';
import { ArticleCategory } from '../domain/article.entity.js';
import { ArticleCategoryAlreadyExistsError } from './errors.js';

export interface CreateArticleCategoryInput {
  name: string;
}

export interface CreateArticleCategoryOutput {
  id: string;
  name: string;
  slug: string;
}

export class CreateArticleCategoryUseCase {
  constructor(private readonly categoryRepo: ArticleCategoryRepository) {}

  async execute(input: CreateArticleCategoryInput): Promise<CreateArticleCategoryOutput> {
    const slug = this.slugify(input.name);

    const existingByName = await this.categoryRepo.findByName(input.name.trim());
    if (existingByName) {
      throw new ArticleCategoryAlreadyExistsError('name', input.name);
    }

    const existingBySlug = await this.categoryRepo.findBySlug(slug);
    if (existingBySlug) {
      throw new ArticleCategoryAlreadyExistsError('slug', slug);
    }

    const category = ArticleCategory.create({ id: randomUUID(), name: input.name.trim(), slug });
    await this.categoryRepo.create(category);

    return { id: category.id, name: category.name, slug: category.slug };
  }

  private slugify(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
