/**
 * @openapi
 * components:
 *   schemas:
 *     AuthTokens:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: Short-lived JWT for API requests
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         refreshToken:
 *           type: string
 *           description: Long-lived token used to obtain a new access token
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         username:
 *           type: string
 *           example: johndoe
 *         displayName:
 *           type: string
 *           example: John Doe
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *           example: [user]
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440001
 *         name:
 *           type: string
 *           example: admin
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user account
 *     description: Creates a new user and returns JWT tokens so the caller is immediately authenticated.
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
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: SecurePassword123
 *               username:
 *                 type: string
 *                 example: johndoe
 *               displayName:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: User created – returns profile and JWT tokens
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
 *                     user:
 *                       $ref: '#/components/schemas/UserProfile'
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       400:
 *         description: Validation error – missing or invalid fields
 *       409:
 *         description: Conflict – email already registered
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login and obtain JWT tokens
 *     description: Authenticates the user with email and password and returns a pair of JWT tokens.
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
 *                 format: email
 *                 example: admin@admin.com
 *               password:
 *                 type: string
 *                 example: SecurePassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       400:
 *         description: Validation error – missing fields
 *       401:
 *         description: Unauthorized – invalid email or password
 */

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     description: Exchanges a valid refresh token for a new short-lived access token.
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
 *                 description: Refresh token obtained from login or register
 *     responses:
 *       200:
 *         description: New access token issued
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
 *                     accessToken:
 *                       type: string
 *       400:
 *         description: Validation error – refreshToken missing
 *       401:
 *         description: Unauthorized – invalid or expired refresh token
 */

/**
 * @openapi
 * /me:
 *   get:
 *     tags: [User]
 *     summary: Get the authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized – no valid token
 */

/**
 * @openapi
 * /me/profile:
 *   patch:
 *     tags: [User]
 *     summary: Update the authenticated user's profile
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
 *                 example: johndoe
 *               displayName:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       200:
 *         description: Profile updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized – no valid token
 *       409:
 *         description: Conflict – username already taken
 */

/**
 * @openapi
 * /me/password:
 *   patch:
 *     tags: [User]
 *     summary: Change the authenticated user's password
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
 *                 description: Current password
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 description: New password (minimum 8 characters)
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Validation error – fields missing or too short
 *       401:
 *         description: Unauthorized – wrong current password or no token
 */

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Admin]
 *     summary: List all users (admin only)
 *     description: Returns every registered user with their assigned roles. Requires the **admin** role.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
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
 *                     $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized – no valid token
 *       403:
 *         description: Forbidden – requires admin role
 */

/**
 * @openapi
 * /users/roles:
 *   get:
 *     tags: [Admin]
 *     summary: List all roles (admin only)
 *     description: Returns every role defined in the system. Requires the **admin** role.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles
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
 *                     $ref: '#/components/schemas/Role'
 *       401:
 *         description: Unauthorized – no valid token
 *       403:
 *         description: Forbidden – requires admin role
 *   post:
 *     tags: [Admin]
 *     summary: Create a new role (admin only)
 *     description: Adds a new role to the system. Role names must be unique. Requires the **admin** role.
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
 *                 example: moderator
 *                 description: Unique role identifier
 *     responses:
 *       201:
 *         description: Role created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Role'
 *       400:
 *         description: Validation error – name missing or invalid
 *       401:
 *         description: Unauthorized – no valid token
 *       403:
 *         description: Forbidden – requires admin role
 *       409:
 *         description: Conflict – role with this name already exists
 */

/**
 * @openapi
 * /users/roles/{roleId}:
 *   put:
 *     tags: [Admin]
 *     summary: Update a role (admin only)
 *     description: Renames an existing role. The new name must be unique. Requires the **admin** role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440001
 *         description: ID of the role to update
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
 *                 description: New unique name for the role
 *     responses:
 *       200:
 *         description: Role updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Role'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized – no valid token
 *       403:
 *         description: Forbidden – requires admin role
 *       404:
 *         description: Not Found – role not found
 *       409:
 *         description: Conflict – role name already taken
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a role (admin only)
 *     description: Permanently removes a role from the system. Requires the **admin** role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440001
 *         description: ID of the role to delete
 *     responses:
 *       200:
 *         description: Role deleted
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
 *         description: Not Found – role not found
 */

/**
 * @openapi
 * /users/{userId}/roles:
 *   get:
 *     tags: [Admin]
 *     summary: Get a user's roles (admin only)
 *     description: Returns all roles currently assigned to a specific user. Requires the **admin** role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         description: ID of the target user
 *     responses:
 *       200:
 *         description: User's roles
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
 *                     $ref: '#/components/schemas/Role'
 *       401:
 *         description: Unauthorized – no valid token
 *       403:
 *         description: Forbidden – requires admin role
 *       404:
 *         description: Not Found – user not found
 *   post:
 *     tags: [Admin]
 *     summary: Assign a role to a user (admin only)
 *     description: Grants an existing role to the specified user. Requires the **admin** role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         description: ID of the target user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roleName]
 *             properties:
 *               roleName:
 *                 type: string
 *                 example: admin
 *                 description: Name of the role to assign
 *     responses:
 *       200:
 *         description: Role assigned successfully
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
 *         description: Not Found – user or role not found
 *       409:
 *         description: Conflict – user already has this role
 */

/**
 * @openapi
 * /users/{userId}/roles/{roleName}:
 *   delete:
 *     tags: [Admin]
 *     summary: Remove a role from a user (admin only)
 *     description: Revokes the specified role from the user. Requires the **admin** role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         description: ID of the target user
 *       - in: path
 *         name: roleName
 *         required: true
 *         schema:
 *           type: string
 *           example: admin
 *         description: Name of the role to remove
 *     responses:
 *       200:
 *         description: Role removed successfully
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
 *         description: Not Found – user or role not found
 */
export {};
