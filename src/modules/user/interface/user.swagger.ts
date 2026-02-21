/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication
 *   - name: User
 *     description: User profile
 *   - name: Admin
 *     description: Admin operations (users and roles management)
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: SecurePassword123
 *               username:
 *                 type: string
 *                 example: johndoe
 *               displayName:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         username:
 *                           type: string
 *                         displayName:
 *                           type: string
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user and get JWT tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@admin.com
 *               password:
 *                 type: string
 *                 example: SecurePassword123
 *     responses:
 *       200:
 *         description: OK - Login successful
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
 *                     accessToken:
 *                       type: string
 *                       description: JWT access token for API requests
 *                     refreshToken:
 *                       type: string
 *                       description: JWT refresh token for getting new access token
 *       401:
 *         description: Unauthorized - Invalid email or password
 */

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token using refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Valid refresh token from login
 *     responses:
 *       200:
 *         description: OK - New access token generated
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
 *                     accessToken:
 *                       type: string
 *       401:
 *         description: Unauthorized - Invalid or expired refresh token
 */

/**
 * @openapi
 * /me:
 *   get:
 *     tags: [User]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */

/**
 * @openapi
 * /me/profile:
 *   patch:
 *     tags: [User]
 *     summary: Update profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               displayName:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 */

/**
 * @openapi
 * /me/password:
 *   patch:
 *     tags: [User]
 *     summary: Change password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 */

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Admin]
 *     summary: List all users (Admin only)
 *     security:
 *       - bearerAuth: []
 *     description: Requires 'admin' role
 *     responses:
 *       200:
 *         description: OK - List of all users with their roles
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "550e8400-e29b-41d4-a716-446655440000"
 *                       email:
 *                         type: string
 *                         example: "user@example.com"
 *                       displayName:
 *                         type: string
 *                         example: "John Doe"
 *                       username:
 *                         type: string
 *                         example: "johndoe"
 *                       roles:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["admin", "moderator"]
 *       401:
 *         description: Unauthorized - No valid token provided
 *       403:
 *         description: Forbidden - User does not have 'admin' role
 */

/**
 * @openapi
 * /roles:
 *   post:
 *     tags: [Admin]
 *     summary: Create new role (Admin only)
 *     security:
 *       - bearerAuth: []
 *     description: Requires 'admin' role. Creates a new system role.
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
 *                 example: moderator
 *                 description: Unique role name
 *     responses:
 *       201:
 *         description: Created - Role created successfully
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
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *       400:
 *         description: Bad Request - Invalid role data
 *       401:
 *         description: Unauthorized - No valid token provided
 *       403:
 *         description: Forbidden - User does not have 'admin' role
 *       409:
 *         description: Conflict - Role already exists
 *   get:
 *     tags: [Admin]
 *     summary: List all available roles (Admin only)
 *     security:
 *       - bearerAuth: []
 *     description: Requires 'admin' role. Returns all system roles.
 *     responses:
 *       200:
 *         description: OK - List of all roles
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                   example:
 *                     - id: "550e8400-e29b-41d4-a716-446655440001"
 *                       name: "admin"
 *                     - id: "550e8400-e29b-41d4-a716-446655440002"
 *                       name: "moderator"
 *       401:
 *         description: Unauthorized - No valid token provided
 *       403:
 *         description: Forbidden - User does not have 'admin' role
 */

/**
 * @openapi
 * /users/{userId}/roles:
 *   get:
 *     tags: [Admin]
 *     summary: Get user's roles (Admin only)
 *     security:
 *       - bearerAuth: []
 *     description: Requires 'admin' role. Returns all roles assigned to a specific user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         description: The user ID
 *     responses:
 *       200:
 *         description: OK - User's roles retrieved successfully
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
 *                     type: string
 *                   example: ["ADMIN", "CUSTOMER"]
 *       401:
 *         description: Unauthorized - No valid token provided
 *       403:
 *         description: Forbidden - User does not have 'admin' role
 *       404:
 *         description: Not Found - User not found
 */

/**
 * @openapi
 * /users/roles/assign:
 *   post:
 *     tags: [Admin]
 *     summary: Assign role to user (Admin only)
 *     security:
 *       - bearerAuth: []
 *     description: Requires 'admin' role. Assigns an existing role to a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, roleName]
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *                 description: The target user ID
 *               roleName:
 *                 type: string
 *                 example: "admin"
 *                 description: The role name to assign (must exist)
 *     responses:
 *       200:
 *         description: OK - Role assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad Request - Invalid request data
 *       401:
 *         description: Unauthorized - No valid token provided
 *       403:
 *         description: Forbidden - User does not have 'admin' role
 *       404:
 *         description: Not Found - User or role not found
 *       409:
 *         description: Conflict - User already has this role
 */

/**
 * @openapi
 * /users/roles/remove:
 *   post:
 *     tags: [Admin]
 *     summary: Remove role from user (Admin only)
 *     security:
 *       - bearerAuth: []
 *     description: Requires 'admin' role. Removes a role from a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, roleName]
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *                 description: The target user ID
 *               roleName:
 *                 type: string
 *                 example: "admin"
 *                 description: The role name to remove
 *     responses:
 *       200:
 *         description: OK - Role removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad Request - Invalid request data
 *       401:
 *         description: Unauthorized - No valid token provided
 *       403:
 *         description: Forbidden - User does not have 'admin' role
 *       404:
 *         description: Not Found - User or role not found
 */
export {};
