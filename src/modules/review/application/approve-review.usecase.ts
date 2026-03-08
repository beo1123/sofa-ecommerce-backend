import { ReviewRepository } from '../domain/review.repository.js';
import { ReviewNotFoundError } from './errors.js';

export interface ApproveReviewOutput {
  id: string;
  approved: boolean;
}

export class ApproveReviewUseCase {
  constructor(private readonly reviewRepo: ReviewRepository) {}

  async execute(id: string, approved: boolean): Promise<ApproveReviewOutput> {
    const review = await this.reviewRepo.findById(id);
    if (!review) throw new ReviewNotFoundError();

    await this.reviewRepo.update(id, { approved });

    return { id, approved };
  }
}
