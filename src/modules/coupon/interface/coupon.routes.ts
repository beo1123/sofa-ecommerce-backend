import { Router } from 'express';
import { PgCouponRepository } from '../infrastructure/coupon.repo.pg.js';
import { CreateCouponUseCase } from '../application/create-coupon.usecase.js';
import { UpdateCouponUseCase } from '../application/update-coupon.usecase.js';
import { DeleteCouponUseCase } from '../application/delete-coupon.usecase.js';
import { GetCouponUseCase } from '../application/get-coupon.usecase.js';
import { ListCouponsUseCase } from '../application/list-coupons.usecase.js';
import { ApplyCouponUseCase } from '../application/apply-coupon.usecase.js';
import { CouponController } from './coupon.controller.js';
import { requireAuth } from '../../../shared/auth/auth.middleware.js';
import { requireRole } from '../../../shared/auth/auth.middleware.js';
import { enrichUserRoles } from '../../../shared/auth/role.middleware.js';

export function createCouponRouter(): Router {
  const couponRepo = new PgCouponRepository();
  const createUC = new CreateCouponUseCase(couponRepo);
  const updateUC = new UpdateCouponUseCase(couponRepo);
  const deleteUC = new DeleteCouponUseCase(couponRepo);
  const getUC = new GetCouponUseCase(couponRepo);
  const listUC = new ListCouponsUseCase(couponRepo);
  const applyUC = new ApplyCouponUseCase(couponRepo);
  const controller = new CouponController(createUC, updateUC, deleteUC, getUC, listUC, applyUC);

  const r = Router();

  // Apply coupon (authenticated users)
  r.post('/apply', requireAuth, controller.handle(controller.apply));

  // Admin routes
  r.use(requireAuth);
  r.use(enrichUserRoles);
  r.use(requireRole('admin'));

  r.get('/', controller.handle(controller.list));
  r.get('/:id', controller.handle(controller.getById));
  r.post('/', controller.handle(controller.create));
  r.patch('/:id', controller.handle(controller.update));
  r.delete('/:id', controller.handle(controller.delete));

  return r;
}
