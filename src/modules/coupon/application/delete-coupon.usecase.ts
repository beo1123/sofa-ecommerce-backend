import { CouponRepository } from '../domain/coupon.repository.js';
import { CouponNotFoundError } from './errors.js';

export class DeleteCouponUseCase {
  constructor(private readonly couponRepo: CouponRepository) {}

  async execute(id: string): Promise<void> {
    const coupon = await this.couponRepo.findById(id);
    if (!coupon) throw new CouponNotFoundError();
    await this.couponRepo.delete(id);
  }
}
