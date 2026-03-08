import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sofa E-commerce API',
      version: '1.0.0',
      description:
        'REST API for the Sofa E-commerce platform. Provides endpoints for authentication, user management, product catalog, categories, and order-related operations.',
      contact: {
        name: 'Sofa E-commerce Team',
      },
    },
    servers: [{ url: 'http://localhost:3000/api/v1', description: 'Local development server' }],
    tags: [
      { name: 'Auth', description: 'Authentication – register, login, and token refresh' },
      { name: 'User', description: 'Current user profile and password management' },
      { name: 'Admin', description: 'Admin-only user and role management' },
      { name: 'Categories', description: 'Product category CRUD' },
      { name: 'Products', description: 'Product catalog and administration' },
      { name: 'Product Statuses', description: 'Product lifecycle statuses' },
      { name: 'Product Images', description: 'Product image management' },
      { name: 'Product Variants', description: 'Product variant and inventory management' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT access token obtained from /auth/login or /auth/refresh',
        },
      },
    },
  },
  apis: ['src/modules/**/*.swagger.ts'],
});
