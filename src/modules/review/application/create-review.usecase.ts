import { randomUUID } from 'crypto';
import { ReviewRepository } from '../domain/review.repository.js';
import { Review } from '../domain/review.entity.js';
import { ReviewAlreadyExistsError, ReviewInvalidRatingError } from './errors.js';

export interface CreateReviewInput {
  userId: string;
  productId: string;
  rating: number;
  title?: string;
  body?: string;
}

export interface CreateReviewOutput {
  id: string;
  userId: string | null;
  productId: string;
  rating: number;
  title: string | null;
  body: string | null;
  approved: boolean;
  createdAt?: Date;
}

export class CreateReviewUseCase {
  constructor(private readonly reviewRepo: ReviewRepository) {}

  async execute(input: CreateReviewInput): Promise<CreateReviewOutput> {
    if (input.rating < 1 || input.rating > 5) throw new ReviewInvalidRatingError();

    const existing = await this.reviewRepo.findByUserAndProduct(input.userId, input.productId);
    if (existing) throw new ReviewAlreadyExistsError();

    const id = randomUUID();
    const review = Review.create({
      id,
      userId: input.userId,
      productId: input.productId,
      rating: input.rating,
      title: input.title ?? null,
      body: input.body ?? null,
      approved: false,
    });

    await this.reviewRepo.create(review);

    return {
      id: review.id,
      userId: review.userId,
      productId: review.productId,
      rating: review.rating,
      title: review.title,
      body: review.body,
      approved: review.approved,
      createdAt: review.createdAt,
    };
  }
}
