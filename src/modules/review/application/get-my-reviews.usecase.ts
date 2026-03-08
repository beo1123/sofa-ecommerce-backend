import { ReviewRepository } from '../domain/review.repository.js';

export interface GetMyReviewsOutput {
  items: Array<{
    id: string;
    productId: string;
    rating: number;
    title: string | null;
    body: string | null;
    approved: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }>;
  total: number;
  limit: number;
  offset: number;
}

export class GetMyReviewsUseCase {
  constructor(private readonly reviewRepo: ReviewRepository) {}

  async execute(userId: string, limit = 20, offset = 0): Promise<GetMyReviewsOutput> {
    const [reviews, total] = await Promise.all([
      this.reviewRepo.findByUser(userId, limit, offset),
      this.reviewRepo.countByUser(userId),
    ]);

    return {
      items: reviews.map((r) => ({
        id: r.id,
        productId: r.productId,
        rating: r.rating,
        title: r.title,
        body: r.body,
        approved: r.approved,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })),
      total,
      limit,
      offset,
    };
  }
}
