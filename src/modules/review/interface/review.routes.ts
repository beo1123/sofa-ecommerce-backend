import { Router } from 'express';
import { PgReviewRepository } from '../infrastructure/review.repo.pg.js';
import { CreateReviewUseCase } from '../application/create-review.usecase.js';
import { UpdateReviewUseCase } from '../application/update-review.usecase.js';
import { DeleteReviewUseCase } from '../application/delete-review.usecase.js';
import { ListReviewsUseCase } from '../application/list-reviews.usecase.js';
import { ApproveReviewUseCase } from '../application/approve-review.usecase.js';
import { GetMyReviewsUseCase } from '../application/get-my-reviews.usecase.js';
import { ReviewController } from './review.controller.js';
import { requireAuth } from '../../../shared/auth/auth.middleware.js';
import { requireRole } from '../../../shared/auth/auth.middleware.js';
import { enrichUserRoles } from '../../../shared/auth/role.middleware.js';

export function createReviewRouter(): Router {
  const reviewRepo = new PgReviewRepository();
  const createUC = new CreateReviewUseCase(reviewRepo);
  const updateUC = new UpdateReviewUseCase(reviewRepo);
  const deleteUC = new DeleteReviewUseCase(reviewRepo);
  const listUC = new ListReviewsUseCase(reviewRepo);
  const approveUC = new ApproveReviewUseCase(reviewRepo);
  const myReviewsUC = new GetMyReviewsUseCase(reviewRepo);
  const controller = new ReviewController(
    createUC,
    updateUC,
    deleteUC,
    listUC,
    approveUC,
    myReviewsUC,
  );

  const r = Router();

  // Public
  r.get('/product/:productId', controller.handle(controller.listByProduct));

  // Authenticated
  r.get('/my', requireAuth, controller.handle(controller.getMyReviews));
  r.post('/', requireAuth, controller.handle(controller.create));
  r.patch('/:id', requireAuth, controller.handle(controller.update));
  r.delete('/:id', requireAuth, enrichUserRoles, controller.handle(controller.delete));

  // Admin
  r.patch(
    '/:id/approve',
    requireAuth,
    enrichUserRoles,
    requireRole('admin'),
    controller.handle(controller.approve),
  );

  return r;
}
