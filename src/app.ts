import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './shared/http/swagger.js';
import { createUserRouter } from './modules/user/interface/user.routes.js';
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
  app.use('/api/v1', createUserRouter());

  // ─────────────────────────────────────────────
  // Global error handler (must be last)
  // ─────────────────────────────────────────────
  app.use(errorHandler);

  return app;
}
