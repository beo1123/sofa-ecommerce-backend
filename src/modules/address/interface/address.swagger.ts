/**
 * @openapi
 * tags:
 *   - name: Addresses
 *     description: User shipping and billing address management
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         fullName:
 *           type: string
 *         line1:
 *           type: string
 *         line2:
 *           type: string
 *           nullable: true
 *         city:
 *           type: string
 *         province:
 *           type: string
 *           nullable: true
 *         postalCode:
 *           type: string
 *           nullable: true
 *         country:
 *           type: string
 *         phone:
 *           type: string
 *           nullable: true
 *         isDefaultShipping:
 *           type: boolean
 *         isDefaultBilling:
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
 * /addresses:
 *   get:
 *     tags: [Addresses]
 *     summary: List all addresses for the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK - List of addresses
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
 *                     $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 *   post:
 *     tags: [Addresses]
 *     summary: Create a new address
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, line1, city, country]
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               line1:
 *                 type: string
 *                 example: "123 Main Street"
 *               line2:
 *                 type: string
 *                 nullable: true
 *                 example: "Apartment 4B"
 *               city:
 *                 type: string
 *                 example: "Ho Chi Minh City"
 *               province:
 *                 type: string
 *                 nullable: true
 *                 example: "District 1"
 *               postalCode:
 *                 type: string
 *                 nullable: true
 *                 example: "700000"
 *               country:
 *                 type: string
 *                 example: VN
 *               phone:
 *                 type: string
 *                 nullable: true
 *                 example: "+84912345678"
 *               isDefaultShipping:
 *                 type: boolean
 *                 default: false
 *               isDefaultBilling:
 *                 type: boolean
 *                 default: false
 *               metadata:
 *                 type: object
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Created - Address saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 *       400:
 *         description: Bad Request - Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /addresses/{id}:
 *   get:
 *     tags: [Addresses]
 *     summary: Get an address by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Address ID
 *     responses:
 *       200:
 *         description: OK - Address details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not your address
 *       404:
 *         description: Not Found
 *   patch:
 *     tags: [Addresses]
 *     summary: Update an address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               line1:
 *                 type: string
 *               line2:
 *                 type: string
 *                 nullable: true
 *               city:
 *                 type: string
 *               province:
 *                 type: string
 *                 nullable: true
 *               postalCode:
 *                 type: string
 *                 nullable: true
 *               country:
 *                 type: string
 *               phone:
 *                 type: string
 *                 nullable: true
 *               isDefaultShipping:
 *                 type: boolean
 *               isDefaultBilling:
 *                 type: boolean
 *               metadata:
 *                 type: object
 *                 nullable: true
 *     responses:
 *       200:
 *         description: OK - Address updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 *       400:
 *         description: Bad Request - Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not your address
 *       404:
 *         description: Not Found
 *   delete:
 *     tags: [Addresses]
 *     summary: Delete an address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Address ID
 *     responses:
 *       200:
 *         description: OK - Address deleted
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
 *         description: Forbidden - Not your address
 *       404:
 *         description: Not Found
 */

/**
 * @openapi
 * /addresses/{id}/default-shipping:
 *   patch:
 *     tags: [Addresses]
 *     summary: Set address as default shipping address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Address ID
 *     responses:
 *       200:
 *         description: OK - Default shipping address updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not your address
 *       404:
 *         description: Not Found
 */

/**
 * @openapi
 * /addresses/{id}/default-billing:
 *   patch:
 *     tags: [Addresses]
 *     summary: Set address as default billing address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Address ID
 *     responses:
 *       200:
 *         description: OK - Default billing address updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not your address
 *       404:
 *         description: Not Found
 */
export {};
