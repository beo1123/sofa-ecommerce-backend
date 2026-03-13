/**
 * @openapi
 * tags:
 *   - name: Articles
 *     description: Blog articles and content management
 *   - name: Article Categories
 *     description: Article category management
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     ArticleCategory:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     Article:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         slug:
 *           type: string
 *         excerpt:
 *           type: string
 *           nullable: true
 *         content:
 *           type: string
 *           nullable: true
 *         thumbnail:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [PUBLISHED, DRAFT]
 *         publishedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         categoryId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         category:
 *           $ref: '#/components/schemas/ArticleCategory'
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
 * /articles/categories:
 *   get:
 *     tags: [Article Categories]
 *     summary: List all article categories
 *     responses:
 *       200:
 *         description: OK - List of article categories
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
 *                     $ref: '#/components/schemas/ArticleCategory'
 *   post:
 *     tags: [Article Categories]
 *     summary: Create an article category (Admin only)
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
 *                 example: Interior Design
 *     responses:
 *       201:
 *         description: Created - Category created (slug auto-generated from name)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ArticleCategory'
 *       400:
 *         description: Bad Request - Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       409:
 *         description: Conflict - Category name already exists
 */

/**
 * @openapi
 * /articles:
 *   get:
 *     tags: [Articles]
 *     summary: List published articles
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
 *         description: Filter by category slug
 *     responses:
 *       200:
 *         description: OK - Paginated list of articles
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
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Article'
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     perPage:
 *                       type: integer
 *   post:
 *     tags: [Articles]
 *     summary: Create a new article (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, status]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Top 10 Sofa Styles for 2024"
 *               excerpt:
 *                 type: string
 *                 nullable: true
 *                 example: "Discover the trending sofa styles this year."
 *               content:
 *                 type: string
 *                 nullable: true
 *               thumbnail:
 *                 type: string
 *                 nullable: true
 *                 example: "https://example.com/images/sofa-styles.jpg"
 *               status:
 *                 type: string
 *                 enum: [PUBLISHED, DRAFT]
 *                 example: PUBLISHED
 *               publishedAt:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Created - Article created (slug auto-generated from title)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 *       400:
 *         description: Bad Request - Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */

/**
 * @openapi
 * /articles/by-slug/{slug}:
 *   get:
 *     tags: [Articles]
 *     summary: Get a published article by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Article slug
 *     responses:
 *       200:
 *         description: OK - Article details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 *       404:
 *         description: Not Found - Article not found or not published
 */

/**
 * @openapi
 * /articles/{id}:
 *   get:
 *     tags: [Articles]
 *     summary: Get article by ID (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Article ID
 *     responses:
 *       200:
 *         description: OK - Article details (includes drafts)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Not Found
 *   patch:
 *     tags: [Articles]
 *     summary: Update an article (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Article ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               excerpt:
 *                 type: string
 *                 nullable: true
 *               content:
 *                 type: string
 *                 nullable: true
 *               thumbnail:
 *                 type: string
 *                 nullable: true
 *               status:
 *                 type: string
 *                 enum: [PUBLISHED, DRAFT]
 *               publishedAt:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *     responses:
 *       200:
 *         description: OK - Article updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 *       400:
 *         description: Bad Request - Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Not Found
 *   delete:
 *     tags: [Articles]
 *     summary: Delete an article (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Article ID
 *     responses:
 *       200:
 *         description: OK - Article deleted
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
