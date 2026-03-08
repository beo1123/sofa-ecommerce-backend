import { ArticleRepository } from '../domain/article.repository.js';
import { ArticleNotFoundError } from './errors.js';

export class DeleteArticleUseCase {
  constructor(private readonly articleRepo: ArticleRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.articleRepo.findById(id);
    if (!existing) {
      throw new ArticleNotFoundError();
    }

    await this.articleRepo.delete(id);
  }
}
