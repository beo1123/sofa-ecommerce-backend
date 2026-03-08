import { Review } from './review.entity.js';

export interface ReviewRepository {
  findById(id: string): Promise<Review | null>;
  findByUserAndProduct(userId: string, productId: string): Promise<Review | null>;
  findByProduct(
    productId: string,
    approvedOnly: boolean,
    limit?: number,
    offset?: number,
  ): Promise<Review[]>;
  findByUser(userId: string, limit?: number, offset?: number): Promise<Review[]>;
  countByProduct(productId: string, approvedOnly: boolean): Promise<number>;
  countByUser(userId: string): Promise<number>;
  create(review: Review): Promise<void>;
  update(
    id: string,
    data: { rating?: number; title?: string | null; body?: string | null; approved?: boolean },
  ): Promise<void>;
  delete(id: string): Promise<void>;
}
