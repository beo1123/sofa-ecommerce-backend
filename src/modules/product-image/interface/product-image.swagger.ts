/**
 * @openapi
 * components:
 *   schemas:
 *     ProductImage:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440030
 *         productId:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440020
 *         url:
 *           type: string
 *           format: uri
 *           example: https://example.com/images/sofa-grey.jpg
 *         alt:
 *           type: string
 *           nullable: true
 *           example: Comfort Cloud Sofa in grey
 *         isPrimary:
 *           type: boolean
 *           example: true
 */

/**
 * @openapi
 * /products/images/{id}:
 *   post:
 *     tags: [Product Images]
 *     summary: Add an image to a product (admin only)
 *     description: Attaches a new image URL to the specified product. Optionally marks it as the primary display image. Requires the **admin** role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440020
 *         description: ID of the product to add the image to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [url]
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/images/sofa-grey.jpg
 *                 description: Publicly accessible URL of the image
 *               alt:
 *                 type: string
 *                 example: Comfort Cloud Sofa in grey
 *                 description: Accessibility alt text for the image (optional)
 *               isPrimary:
 *                 type: boolean
 *                 default: false
 *                 description: When true this becomes the product's primary display image
 *     responses:
 *       201:
 *         description: Image added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ProductImage'
 *       400:
 *         description: Validation error – url missing or not a valid URI
 *       401:
 *         description: Unauthorized – no valid token
 *       403:
 *         description: Forbidden – requires admin role
 *       404:
 *         description: Not Found – product not found
 */

/**
 * @openapi
 * /products/images/{imageId}:
 *   delete:
 *     tags: [Product Images]
 *     summary: Remove a product image (admin only)
 *     description: Permanently deletes a product image by its ID. Requires the **admin** role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440030
 *         description: ID of the image to delete
 *     responses:
 *       200:
 *         description: Image deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized – no valid token
 *       403:
 *         description: Forbidden – requires admin role
 *       404:
 *         description: Not Found – image not found
 */

/**
 * @openapi
 * /products/images/{id}/{imageId}/primary:
 *   patch:
 *     tags: [Product Images]
 *     summary: Set an image as the primary product image (admin only)
 *     description: Marks the specified image as the primary (featured) image for the product, clearing the primary flag from any previously primary image. Requires the **admin** role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440020
 *         description: ID of the product
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440030
 *         description: ID of the image to promote as primary
 *     responses:
 *       200:
 *         description: Primary image updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized – no valid token
 *       403:
 *         description: Forbidden – requires admin role
 *       404:
 *         description: Not Found – product or image not found
 */
export {};
