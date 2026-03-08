import { ReviewRepository } from '../domain/review.repository.js';

export interface ListReviewsOutput {
  items: Array<{
    id: string;
    userId: string | null;
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

export class ListReviewsUseCase {
  constructor(private readonly reviewRepo: ReviewRepository) {}

  async execute(
    productId: string,
    approvedOnly: boolean,
    limit = 20,
    offset = 0,
  ): Promise<ListReviewsOutput> {
    const [reviews, total] = await Promise.all([
      this.reviewRepo.findByProduct(productId, approvedOnly, limit, offset),
      this.reviewRepo.countByProduct(productId, approvedOnly),
    ]);

    return {
      items: reviews.map((r) => ({
        id: r.id,
        userId: r.userId,
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
