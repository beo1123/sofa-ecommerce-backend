import { CategoryRepository } from '../domain/category.repository.js';
import { CategoryNotFoundError } from './errors.js';

export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  async execute(id: string): Promise<void> {
    // Check if category exists
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new CategoryNotFoundError();
    }

    await this.categoryRepo.delete(id);
  }
}
