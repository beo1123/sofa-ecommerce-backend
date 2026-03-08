/**
 * @openapi
 * components:
 *   schemas:
 *     ProductStatus:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440040
 *         name:
 *           type: string
 *           example: active
 *         description:
 *           type: string
 *           nullable: true
 *           example: Product is visible and available for purchase
 */

/**
 * @openapi
 * /products/statuses:
 *   get:
 *     tags: [Product Statuses]
 *     summary: List all product statuses
 *     description: Returns all available product lifecycle statuses. Public endpoint.
 *     responses:
 *       200:
 *         description: List of product statuses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductStatus'
 *   post:
 *     tags: [Product Statuses]
 *     summary: Create a new product status (admin only)
 *     description: Adds a new product lifecycle status to the system. Requires the **admin** role.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 example: archived
 *                 description: Unique status identifier
 *               description:
 *                 type: string
 *                 example: Product is no longer available
 *                 description: Human-readable explanation of the status
 *     responses:
 *       201:
 *         description: Status created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: archived
 *       400:
 *         description: Validation error – name missing or empty
 *       401:
 *         description: Unauthorized – no valid token
 *       403:
 *         description: Forbidden – requires admin role
 *       409:
 *         description: Conflict – status with this name already exists
 */
export {};
