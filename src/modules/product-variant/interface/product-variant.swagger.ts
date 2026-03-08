/**
 * @openapi
 * components:
 *   schemas:
 *     ProductVariant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440050
 *         productId:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440020
 *         name:
 *           type: string
 *           example: Grey Fabric
 *         skuPrefix:
 *           type: string
 *           nullable: true
 *           example: CCS-GRY
 *         colorCode:
 *           type: string
 *           nullable: true
 *           example: '#9E9E9E'
 *         colorName:
 *           type: string
 *           nullable: true
 *           example: Grey
 *         material:
 *           type: string
 *           nullable: true
 *           example: fabric
 *         price:
 *           type: number
 *           example: 599.99
 *         compareAtPrice:
 *           type: number
 *           nullable: true
 *           example: 749.99
 *         image:
 *           type: string
 *           nullable: true
 *           example: https://example.com/images/sofa-grey.jpg
 */

/**
 * @openapi
 * /products/variants/{id}:
 *   post:
 *     tags: [Product Variants]
 *     summary: Add a variant to a product (admin only)
 *     description: Creates a new variant for the specified product. Requires the **admin** role.
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
 *         description: ID of the product to add the variant to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 example: Grey Fabric
 *                 description: Variant display name
 *               skuPrefix:
 *                 type: string
 *                 example: CCS-GRY
 *                 description: Optional SKU prefix used when generating inventory SKUs
 *               colorCode:
 *                 type: string
 *                 example: '#9E9E9E'
 *                 description: CSS hex color code for the variant color swatch
 *               colorName:
 *                 type: string
 *                 example: Grey
 *                 description: Human-readable color label
 *               material:
 *                 type: string
 *                 example: fabric
 *                 description: Material used for this variant
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 599.99
 *                 description: Selling price (must be ≥ 0)
 *               compareAtPrice:
 *                 type: number
 *                 minimum: 0
 *                 example: 749.99
 *                 description: Original / crossed-out price (must be ≥ 0)
 *               image:
 *                 type: string
 *                 example: https://example.com/images/sofa-grey.jpg
 *                 description: Optional variant-specific image URL
 *     responses:
 *       201:
 *         description: Variant added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ProductVariant'
 *       400:
 *         description: Validation error – required fields missing or invalid
 *       401:
 *         description: Unauthorized – no valid token
 *       403:
 *         description: Forbidden – requires admin role
 *       404:
 *         description: Not Found – product not found
 */

/**
 * @openapi
 * /products/variants/{variantId}:
 *   patch:
 *     tags: [Product Variants]
 *     summary: Update a product variant (admin only)
 *     description: Partially updates variant properties. Only supplied fields are changed. Requires the **admin** role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440050
 *         description: ID of the variant to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 example: Dark Grey Fabric
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 649.99
 *               compareAtPrice:
 *                 type: number
 *                 minimum: 0
 *                 example: 799.99
 *               image:
 *                 type: string
 *                 example: https://example.com/images/sofa-dark-grey.jpg
 *               colorCode:
 *                 type: string
 *                 example: '#616161'
 *               colorName:
 *                 type: string
 *                 example: Dark Grey
 *               material:
 *                 type: string
 *                 example: velvet
 *     responses:
 *       200:
 *         description: Variant updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized – no valid token
 *       403:
 *         description: Forbidden – requires admin role
 *       404:
 *         description: Not Found – variant not found
 */

/**
 * @openapi
 * /products/variants/{variantId}/inventory:
 *   patch:
 *     tags: [Product Variants]
 *     summary: Update inventory counts for a variant (admin only)
 *     description: Sets the on-hand quantity and optionally the reserved quantity for the variant. Requires the **admin** role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440050
 *         description: ID of the variant to update inventory for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 50
 *                 description: Total on-hand stock quantity
 *               reserved:
 *                 type: integer
 *                 example: 5
 *                 description: Number of units currently reserved (e.g. in pending orders)
 *     responses:
 *       200:
 *         description: Inventory updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Validation error – quantity missing or not an integer
 *       401:
 *         description: Unauthorized – no valid token
 *       403:
 *         description: Forbidden – requires admin role
 *       404:
 *         description: Not Found – variant not found
 */
export {};
