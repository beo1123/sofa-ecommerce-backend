/**
 * @openapi
 * tags:
 *   - name: Products
 *     description: Product catalog and administration
 */

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
 *         title:
 *           type: string
 *         slug:
 *           type: string
 *         shortDescription:
 *           type: string
 *           nullable: true
 *         description:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *         categoryId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *     ProductStatus:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *     ProductListItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         slug:
 *           type: string
 *         shortDescription:
 *           type: string
 *           nullable: true
 *         priceMin:
 *           type: number
 *           nullable: true
 *         priceMax:
 *           type: number
 *           nullable: true
 *         primaryImage:
 *           type: object
 *           nullable: true
 *           properties:
 *             url:
 *               type: string
 *             alt:
 *               type: string
 *               nullable: true
 *         variantsCount:
 *           type: integer
 *         category:
 *           type: object
 *           nullable: true
 *           properties:
 *             name:
 *               type: string
 *             slug:
 *               type: string
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
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: category slug to filter
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: full text query
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *       - in: query
 *         name: material
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc,price_desc,newest]
 *     responses:
 *       200:
 *         description: paginated list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ProductListItem'
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     perPage:
 *                       type: integer
 *   post:
 *     tags: [Products]
 *     summary: Create new product (admin)
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
 *               slug:
 *                 type: string
 *                 description: optional, auto-generated from title if absent
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
 *       201:
 *         description: product created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: validation error
 *       401:
 *         description: unauthorized
 *       403:
 *         description: forbidden (admin only)
 *       409:
 *         description: conflict (slug exists)
 */

/**
 * @openapi
 * /products/{slug}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: product details
 *       404:
 *         description: not found
 */

/**
 * @openapi
 * /products/related/{slug}:
 *   get:
 *     tags: [Products]
 *     summary: Get related products by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: list of related items
 */

/**
 * @openapi
 * /products/best-selling:
 *   get:
 *     tags: [Products]
 *     summary: Top selling products
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 8
 *     responses:
 *       200:
 *         description: array of ProductListItem
 */

/**
 * @openapi
 * /products/featured:
 *   get:
 *     tags: [Products]
 *     summary: Featured products (score based)
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 8
 *     responses:
 *       200:
 *         description: array of ProductListItem
 */

/**
 * @openapi
 * /products/filters:
 *   get:
 *     tags: [Products]
 *     summary: Retrieve available filter options (materials/colors/prices)
 *     responses:
 *       200:
 *         description: filter data
 */

/**
 * @openapi
 * /products/statuses:
 *   get:
 *     tags: [Products]
 *     summary: List all product statuses (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: array of statuses
 *   post:
 *     tags: [Products]
 *     summary: Create new product status (admin)
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
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: status created
 *       400:
 *         description: validation error
 *       401:
 *         description: unauthorized
 *       403:
 *         description: forbidden
 */

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by id (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: product details
 *       404:
 *         description: not found
 *   patch:
 *     tags: [Products]
 *     summary: Update a product (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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
 *         description: updated product
 *       400:
 *         description: validation error
 *       401:
 *         description: unauthorized
 *       403:
 *         description: forbidden
 *       404:
 *         description: not found
 *       409:
 *         description: slug conflict
 *   delete:
 *     tags: [Products]
 *     summary: Delete a product (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: deleted
 *       401:
 *         description: unauthorized
 *       403:
 *         description: forbidden
 *       404:
 *         description: not found
 */

/**
 * @openapi
 * /products/{id}/images:
 *   post:
 *     tags: [Products]
 *     summary: Add image to product (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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
 *               alt:
 *                 type: string
 *               isPrimary:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: image added
 *       400:
 *         description: validation error
 *       401:
 *         description: unauthorized
 *       403:
 *         description: forbidden
 */

/**
 * @openapi
 * /products/images/{imageId}:
 *   delete:
 *     tags: [Products]
 *     summary: Remove product image (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: removed
 *       401:
 *         description: unauthorized
 *       403:
 *         description: forbidden
 */

/**
 * @openapi
 * /products/{id}/images/{imageId}/primary:
 *   patch:
 *     tags: [Products]
 *     summary: Mark an image as primary (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: updated
 *       401:
 *         description: unauthorized
 *       403:
 *         description: forbidden
 */

/**
 * @openapi
 * /products/{id}/variants:
 *   post:
 *     tags: [Products]
 *     summary: Add variant to product (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name,price]
 *             properties:
 *               name:
 *                 type: string
 *               skuPrefix:
 *                 type: string
 *               colorCode:
 *                 type: string
 *               colorName:
 *                 type: string
 *               material:
 *                 type: string
 *               price:
 *                 type: number
 *               compareAtPrice:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: variant added
 *       400:
 *         description: validation error
 *       401:
 *         description: unauthorized
 *       403:
 *         description: forbidden
 */

/**
 * @openapi
 * /products/variants/{variantId}:
 *   patch:
 *     tags: [Products]
 *     summary: Update a variant (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               compareAtPrice:
 *                 type: number
 *               image:
 *                 type: string
 *               colorCode:
 *                 type: string
 *               colorName:
 *                 type: string
 *               material:
 *                 type: string
 *     responses:
 *       200:
 *         description: updated
 *       401:
 *         description: unauthorized
 *       403:
 *         description: forbidden
 */

/**
 * @openapi
 * /products/variants/{variantId}/inventory:
 *   patch:
 *     tags: [Products]
 *     summary: Update inventory counts for a variant (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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
 *               reserved:
 *                 type: integer
 *     responses:
 *       200:
 *         description: updated
 *       401:
 *         description: unauthorized
 *       403:
 *         description: forbidden
 */
