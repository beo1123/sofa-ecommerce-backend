/**
 * @openapi
 * tags:
 *   - name: Coupons
 *     description: Coupon and discount code management
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Coupon:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         code:
 *           type: string
 *           example: SUMMER20
 *         type:
 *           type: string
 *           enum: [FIXED, PERCENT]
 *         amount:
 *           type: number
 *           nullable: true
 *           description: Fixed discount amount (used when type is FIXED)
 *         percent:
 *           type: number
 *           nullable: true
 *           description: Discount percentage 0-100 (used when type is PERCENT)
 *         description:
 *           type: string
 *           nullable: true
 *         startsAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         usageLimit:
 *           type: integer
 *           nullable: true
 *           description: Maximum total uses allowed
 *         usageLimitPerUser:
 *           type: integer
 *           nullable: true
 *           description: Maximum uses allowed per user
 *         usedCount:
 *           type: integer
 *         isActive:
 *           type: boolean
 *         metadata:
 *           type: object
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /coupons/apply:
 *   post:
 *     tags: [Coupons]
 *     summary: Apply a coupon code
 *     description: Validates a coupon code against a subtotal and returns the discount amount.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, subtotal]
 *             properties:
 *               code:
 *                 type: string
 *                 example: SUMMER20
 *               subtotal:
 *                 type: number
 *                 example: 500000
 *                 description: Order subtotal in smallest currency unit
 *     responses:
 *       200:
 *         description: OK - Coupon applied successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     discount:
 *                       type: number
 *                       description: Discount amount to deduct from subtotal
 *                     couponId:
 *                       type: string
 *                       format: uuid
 *       400:
 *         description: Bad Request - Invalid or expired coupon
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found - Coupon code does not exist
 */

/**
 * @openapi
 * /coupons:
 *   get:
 *     tags: [Coupons]
 *     summary: List all coupons (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK - List of coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Coupon'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *   post:
 *     tags: [Coupons]
 *     summary: Create a new coupon (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, type]
 *             properties:
 *               code:
 *                 type: string
 *                 example: SUMMER20
 *               type:
 *                 type: string
 *                 enum: [FIXED, PERCENT]
 *                 example: PERCENT
 *               amount:
 *                 type: number
 *                 nullable: true
 *                 example: null
 *                 description: Required when type is FIXED
 *               percent:
 *                 type: number
 *                 nullable: true
 *                 example: 20
 *                 description: Required when type is PERCENT (0-100)
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "Summer sale 20% off"
 *               startsAt:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               usageLimit:
 *                 type: integer
 *                 nullable: true
 *               usageLimitPerUser:
 *                 type: integer
 *                 nullable: true
 *               isActive:
 *                 type: boolean
 *                 default: true
 *               metadata:
 *                 type: object
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Created - Coupon created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Coupon'
 *       400:
 *         description: Bad Request - Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       409:
 *         description: Conflict - Coupon code already exists
 */

/**
 * @openapi
 * /coupons/{id}:
 *   get:
 *     tags: [Coupons]
 *     summary: Get coupon by ID (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: OK - Coupon details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Coupon'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Not Found
 *   patch:
 *     tags: [Coupons]
 *     summary: Update a coupon (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Coupon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [FIXED, PERCENT]
 *               amount:
 *                 type: number
 *                 nullable: true
 *               percent:
 *                 type: number
 *                 nullable: true
 *               description:
 *                 type: string
 *                 nullable: true
 *               startsAt:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               usageLimit:
 *                 type: integer
 *                 nullable: true
 *               usageLimitPerUser:
 *                 type: integer
 *                 nullable: true
 *               isActive:
 *                 type: boolean
 *               metadata:
 *                 type: object
 *                 nullable: true
 *     responses:
 *       200:
 *         description: OK - Coupon updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Coupon'
 *       400:
 *         description: Bad Request - Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Not Found
 *       409:
 *         description: Conflict - Coupon code already exists
 *   delete:
 *     tags: [Coupons]
 *     summary: Delete a coupon (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: OK - Coupon deleted
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
 *         description: Forbidden - Admin only
 *       404:
 *         description: Not Found
 */
export {};
