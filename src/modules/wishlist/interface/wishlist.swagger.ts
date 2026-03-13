/**
 * @openapi
 * tags:
 *   - name: Wishlist
 *     description: User wishlist management
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     WishlistItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         productId:
 *           type: string
 *           format: uuid
 *         variantId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *     Wishlist:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WishlistItem'
 */

/**
 * @openapi
 * /wishlist:
 *   get:
 *     tags: [Wishlist]
 *     summary: Get current user's wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK - Wishlist with all items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Wishlist'
 *       401:
 *         description: Unauthorized
 *   delete:
 *     tags: [Wishlist]
 *     summary: Clear all items from wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK - Wishlist cleared
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /wishlist/items:
 *   post:
 *     tags: [Wishlist]
 *     summary: Add a product to wishlist
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *                 description: Product to add
 *               variantId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: Optional specific variant to wishlist
 *     responses:
 *       201:
 *         description: Created - Item added to wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/WishlistItem'
 *       400:
 *         description: Bad Request - Validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Conflict - Item already in wishlist
 */

/**
 * @openapi
 * /wishlist/items/{itemId}:
 *   delete:
 *     tags: [Wishlist]
 *     summary: Remove a specific item from wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Wishlist item ID
 *     responses:
 *       200:
 *         description: OK - Item removed from wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not your wishlist item
 *       404:
 *         description: Not Found - Wishlist item not found
 */
export {};
