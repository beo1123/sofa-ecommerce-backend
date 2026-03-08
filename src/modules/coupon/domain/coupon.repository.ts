import { Coupon } from './coupon.entity.js';

export interface CouponRepository {
  findById(id: string): Promise<Coupon | null>;
  findByCode(code: string): Promise<Coupon | null>;
  create(coupon: Coupon): Promise<void>;
  update(id: string, data: Partial<Omit<Coupon, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(limit?: number, offset?: number): Promise<Coupon[]>;
  count(): Promise<number>;
  incrementUsage(id: string): Promise<void>;
}
