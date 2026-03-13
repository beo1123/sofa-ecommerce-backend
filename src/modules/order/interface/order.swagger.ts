/**
 * @openapi
 * tags:
 *   - name: Orders
 *     description: Order management and tracking
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *           format: uuid
 *         variantId:
 *           type: string
 *           format: uuid
 *         quantity:
 *           type: integer
 *           minimum: 1
 *         price:
 *           type: number
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         status:
 *           type: string
 *           enum: [CREATED, CONFIRMED, SHIPPING, DELIVERED, CANCELLED]
 *         recipientName:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *         address:
 *           type: string
 *         paymentMethod:
 *           type: string
 *         couponId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         shipping:
 *           type: number
 *         tax:
 *           type: number
 *         total:
 *           type: number
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
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: List orders
 *     description: Authenticated users see their own orders. Admins see all orders.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK - List of orders
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
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *   post:
 *     tags: [Orders]
 *     summary: Create a new order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [shippingAddressId, billingAddressId, recipientName, phone, email, address, paymentMethod, items]
 *             properties:
 *               shippingAddressId:
 *                 type: string
 *                 format: uuid
 *                 description: Address ID for shipping
 *               billingAddressId:
 *                 type: string
 *                 format: uuid
 *                 description: Address ID for billing
 *               recipientName:
 *                 type: string
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 example: "+84912345678"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               address:
 *                 type: string
 *                 example: "123 Main St, District 1, Ho Chi Minh City"
 *               paymentMethod:
 *                 type: string
 *                 example: COD
 *               couponId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: Optional coupon to apply
 *               shipping:
 *                 type: number
 *                 example: 30000
 *               tax:
 *                 type: number
 *                 example: 0
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   $ref: '#/components/schemas/OrderItem'
 *     responses:
 *       201:
 *         description: Created - Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad Request - Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order by ID
 *     description: Users can only access their own orders. Admins can access any order.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order ID
 *     responses:
 *       200:
 *         description: OK - Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not your order
 *       404:
 *         description: Not Found
 */

/**
 * @openapi
 * /orders/{id}/status:
 *   patch:
 *     tags: [Orders]
 *     summary: Update order status (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [CREATED, CONFIRMED, SHIPPING, DELIVERED, CANCELLED]
 *                 example: CONFIRMED
 *     responses:
 *       200:
 *         description: OK - Status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad Request - Invalid status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Not Found
 */

/**
 * @openapi
 * /orders/{id}/cancel:
 *   post:
 *     tags: [Orders]
 *     summary: Cancel an order
 *     description: Users can cancel their own orders. Admins can cancel any order.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order ID
 *     responses:
 *       200:
 *         description: OK - Order cancelled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not your order
 *       404:
 *         description: Not Found
 *       409:
 *         description: Conflict - Order cannot be cancelled in its current status
 */
export {};
