import { ReviewRepository } from '../domain/review.repository.js';
import { ReviewNotFoundError, ReviewForbiddenError, ReviewInvalidRatingError } from './errors.js';

export interface UpdateReviewInput {
  rating?: number;
  title?: string | null;
  body?: string | null;
}

export interface UpdateReviewOutput {
  id: string;
  userId: string | null;
  productId: string;
  rating: number;
  title: string | null;
  body: string | null;
  approved: boolean;
  updatedAt?: Date;
}

export class UpdateReviewUseCase {
  constructor(private readonly reviewRepo: ReviewRepository) {}

  async execute(
    id: string,
    requesterId: string,
    input: UpdateReviewInput,
  ): Promise<UpdateReviewOutput> {
    const review = await this.reviewRepo.findById(id);
    if (!review) throw new ReviewNotFoundError();

    if (review.userId !== requesterId) throw new ReviewForbiddenError();

    if (input.rating !== undefined && (input.rating < 1 || input.rating > 5)) {
      throw new ReviewInvalidRatingError();
    }

    await this.reviewRepo.update(id, input);

    const updated = await this.reviewRepo.findById(id);
    if (!updated) throw new ReviewNotFoundError();

    return {
      id: updated.id,
      userId: updated.userId,
      productId: updated.productId,
      rating: updated.rating,
      title: updated.title,
      body: updated.body,
      approved: updated.approved,
      updatedAt: updated.updatedAt,
    };
  }
}
