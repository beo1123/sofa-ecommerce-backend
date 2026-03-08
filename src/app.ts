import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './shared/http/swagger.js';
import { createUserRouter, createAuthRouter } from './modules/user/interface/user.routes.js';
import { createCategoryRouter } from './modules/category/interface/category.routes.js';
import { createProductRouter } from './modules/product/interface/product.routes.js';
import { createProductStatusRouter } from './modules/product-status/interface/product-status.routes.js';
import { createProductImageRouter } from './modules/product-image/interface/product-image.routes.js';
import { createProductVariantRouter } from './modules/product-variant/interface/product-variant.routes.js';
import { createCouponRouter } from './modules/coupon/interface/coupon.routes.js';
import { createReviewRouter } from './modules/review/interface/review.routes.js';
import { createWishlistRouter } from './modules/wishlist/interface/wishlist.routes.js';
import { createArticleRouter } from './modules/article/interface/article.routes.js';
import { createReturnRequestRouter } from './modules/return-request/interface/return-request.routes.js';
import { errorHandler } from './shared/http/error-handler.js';

export function createApp() {
  const app = express();

  // ─────────────────────────────────────────────
  // Global middlewares
  // ─────────────────────────────────────────────
  app.use(cors());
  app.use(helmet());
  app.use(express.json());

  // ─────────────────────────────────────────────
  // Health check
  // ─────────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  // ─────────────────────────────────────────────
  // Swagger
  // ─────────────────────────────────────────────
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // ─────────────────────────────────────────────
  // API routes
  // ─────────────────────────────────────────────
  const apiV1 = express.Router();
  apiV1.use('/auth', createAuthRouter());
  apiV1.use('/me', createUserRouter());
  apiV1.use('/users', createUserRouter());
  apiV1.use('/categories', createCategoryRouter());
  apiV1.use('/products', createProductRouter());
  // auxiliary product sub-modules
  apiV1.use('/products/statuses', createProductStatusRouter());
  apiV1.use('/products/images', createProductImageRouter());
  apiV1.use('/products/variants', createProductVariantRouter());
  apiV1.use('/coupons', createCouponRouter());
  apiV1.use('/reviews', createReviewRouter());
  apiV1.use('/wishlist', createWishlistRouter());
  apiV1.use('/articles', createArticleRouter());
  apiV1.use('/returns', createReturnRequestRouter());
  app.use('/api/v1', apiV1);

  // ─────────────────────────────────────────────
  // Global error handler (must be last)
  // ─────────────────────────────────────────────
  app.use(errorHandler);

  return app;
}
