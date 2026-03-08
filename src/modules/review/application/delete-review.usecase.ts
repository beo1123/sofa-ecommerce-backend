import { ReviewRepository } from '../domain/review.repository.js';
import { ReviewNotFoundError, ReviewForbiddenError } from './errors.js';

export class DeleteReviewUseCase {
  constructor(private readonly reviewRepo: ReviewRepository) {}

  async execute(id: string, requesterId: string, isAdmin: boolean): Promise<void> {
    const review = await this.reviewRepo.findById(id);
    if (!review) throw new ReviewNotFoundError();

    if (!isAdmin && review.userId !== requesterId) throw new ReviewForbiddenError();

    await this.reviewRepo.delete(id);
  }
}
