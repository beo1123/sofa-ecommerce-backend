/**
 * @openapi
 * tags:
 *   - name: Return Requests
 *     description: Product return and refund request management
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     ReturnRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         orderId:
 *           type: string
 *           format: uuid
 *         orderItemId:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         reason:
 *           type: string
 *         evidence:
 *           type: string
 *           nullable: true
 *           description: URL or description of supporting evidence (e.g. photo URL)
 *         status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, COMPLETED]
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
 * /returns:
 *   get:
 *     tags: [Return Requests]
 *     summary: List return requests
 *     description: Users see their own return requests. Admins see all return requests.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK - List of return requests
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
 *                     $ref: '#/components/schemas/ReturnRequest'
 *       401:
 *         description: Unauthorized
 *   post:
 *     tags: [Return Requests]
 *     summary: Submit a return request
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId, orderItemId, reason]
 *             properties:
 *               orderId:
 *                 type: string
 *                 format: uuid
 *                 description: The order ID containing the item to return
 *               orderItemId:
 *                 type: string
 *                 format: uuid
 *                 description: The specific order item ID to return
 *               reason:
 *                 type: string
 *                 example: "Product arrived damaged"
 *               evidence:
 *                 type: string
 *                 nullable: true
 *                 example: "https://example.com/images/damage-photo.jpg"
 *                 description: URL or description of supporting evidence
 *               metadata:
 *                 type: object
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Created - Return request submitted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ReturnRequest'
 *       400:
 *         description: Bad Request - Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found - Order or order item not found
 *       409:
 *         description: Conflict - Return request already exists for this item
 */

/**
 * @openapi
 * /returns/{id}:
 *   get:
 *     tags: [Return Requests]
 *     summary: Get a return request by ID
 *     description: Users can only view their own return requests. Admins can view any.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Return request ID
 *     responses:
 *       200:
 *         description: OK - Return request details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ReturnRequest'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not your return request
 *       404:
 *         description: Not Found
 */

/**
 * @openapi
 * /returns/{id}/process:
 *   patch:
 *     tags: [Return Requests]
 *     summary: Process a return request (Admin only)
 *     description: Approve, reject, or mark a return request as completed.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Return request ID
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
 *                 enum: [APPROVED, REJECTED, COMPLETED]
 *                 example: APPROVED
 *     responses:
 *       200:
 *         description: OK - Return request processed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ReturnRequest'
 *       400:
 *         description: Bad Request - Invalid status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Not Found
 */
export {};
