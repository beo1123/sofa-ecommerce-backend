/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440020
 *         title:
 *           type: string
 *           example: Comfort Cloud Sofa
 *         slug:
 *           type: string
 *           example: comfort-cloud-sofa
 *         shortDescription:
 *           type: string
 *           nullable: true
 *           example: A plush three-seat sofa with cloud-like cushions.
 *         description:
 *           type: string
 *           nullable: true
 *           example: Full description of the product.
 *         status:
 *           type: string
 *           example: active
 *         categoryId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: 550e8400-e29b-41d4-a716-446655440010
 *     ProductListItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440020
 *         title:
 *           type: string
 *           example: Comfort Cloud Sofa
 *         slug:
 *           type: string
 *           example: comfort-cloud-sofa
 *         shortDescription:
 *           type: string
 *           nullable: true
 *         priceMin:
 *           type: number
 *           nullable: true
 *           example: 499.99
 *         priceMax:
 *           type: number
 *           nullable: true
 *           example: 799.99
 *         primaryImage:
 *           type: object
 *           nullable: true
 *           properties:
 *             url:
 *               type: string
 *               example: https://example.com/images/sofa.jpg
 *             alt:
 *               type: string
 *               nullable: true
 *               example: Comfort Cloud Sofa in grey
 *         variantsCount:
 *           type: integer
 *           example: 3
 *         category:
 *           type: object
 *           nullable: true
 *           properties:
 *             name:
 *               type: string
 *               example: Sofas
 *             slug:
 *               type: string
 *               example: sofas
 *         variants:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               skuPrefix:
 *                 type: string
 *                 nullable: true
 *               price:
 *                 type: number
 *               inventory:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     sku:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     reserved:
 *                       type: integer
 */

/**
 * @openapi
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: List / search products
 *     description: Returns a paginated, filterable list of products. Public endpoint.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number (1-based)
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           default: 20
 *           minimum: 1
 *           maximum: 100
 *         description: Results per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category slug
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Full-text search query (matches title and description)
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *         description: Filter by color name
 *       - in: query
 *         name: material
 *         schema:
 *           type: string
 *         description: Filter by material
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, newest]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Paginated product list
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
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ProductListItem'
 *                     total:
 *                       type: integer
 *                       example: 42
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     perPage:
 *                       type: integer
 *                       example: 20
 *   post:
 *     tags: [Products]
 *     summary: Create a new product (admin only)
 *     description: Creates a product record. The slug is auto-generated from the title if not provided. Requires the **admin** role.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Comfort Cloud Sofa
 *               slug:
 *                 type: string
 *                 description: Optional – auto-generated from title if omitted
 *                 example: comfort-cloud-sofa
 *               shortDescription:
 *                 type: string
 *                 example: A plush three-seat sofa.
 *               description:
 *                 type: string
 *                 example: Full product description.
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 example: 550e8400-e29b-41d4-a716-446655440010
 *               status:
 *                 type: string
 *                 example: active
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized – no valid token
 *       403:
 *         description: Forbidden – requires admin role
 *       409:
 *         description: Conflict – slug already in use
 */

/**
 * @openapi
 * /products/by-slug/{slug}:
 *   get:
 *     tags: [Products]
 *     summary: Get a product by slug
 *     description: Returns full product details including variants and images. Public endpoint.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           example: comfort-cloud-sofa
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Not Found – no product with this slug
 */

/**
 * @openapi
 * /products/related/{slug}:
 *   get:
 *     tags: [Products]
 *     summary: Get products related to a given product
 *     description: Returns products in the same category as the given product. Public endpoint.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           example: comfort-cloud-sofa
 *     responses:
 *       200:
 *         description: List of related products
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
 *                     $ref: '#/components/schemas/ProductListItem'
 */

/**
 * @openapi
 * /products/best-selling:
 *   get:
 *     tags: [Products]
 *     summary: Get top-selling products
 *     description: Returns the best-selling products ordered by sales volume. Public endpoint.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 8
 *           minimum: 1
 *           maximum: 50
 *         description: Number of products to return
 *     responses:
 *       200:
 *         description: Best-selling products
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
 *                     $ref: '#/components/schemas/ProductListItem'
 */

/**
 * @openapi
 * /products/featured:
 *   get:
 *     tags: [Products]
 *     summary: Get featured products
 *     description: Returns editorially featured products ordered by feature score. Public endpoint.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 8
 *           minimum: 1
 *           maximum: 50
 *         description: Number of products to return
 *     responses:
 *       200:
 *         description: Featured products
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
 *                     $ref: '#/components/schemas/ProductListItem'
 */

/**
 * @openapi
 * /products/filters:
 *   get:
 *     tags: [Products]
 *     summary: Get available filter options
 *     description: Returns distinct colors, materials and price bounds that can be used to filter the catalog. Public endpoint.
 *     responses:
 *       200:
 *         description: Filter options
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
 *                     colors:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [grey, beige, navy]
 *                     materials:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [fabric, leather, velvet]
 *                     priceMin:
 *                       type: number
 *                       example: 199.99
 *                     priceMax:
 *                       type: number
 *                       example: 2499.99
 */

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get a product by ID (admin only)
 *     description: Returns full product details by UUID. Requires the **admin** role.
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
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized – no valid token
 *       403:
 *         description: Forbidden – requires admin role
 *       404:
 *         description: Not Found – product not found
 *   patch:
 *     tags: [Products]
 *     summary: Update a product (admin only)
 *     description: Partially updates a product. Providing a new title regenerates the slug unless a custom slug is also supplied. Requires the **admin** role.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized – no valid token
 *       403:
 *         description: Forbidden – requires admin role
 *       404:
 *         description: Not Found – product not found
 *       409:
 *         description: Conflict – slug already in use by another product
 *   delete:
 *     tags: [Products]
 *     summary: Delete a product (admin only)
 *     description: Permanently removes a product and all its associated images and variants. Requires the **admin** role.
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
 *     responses:
 *       200:
 *         description: Product deleted
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
 *         description: Not Found – product not found
 */
