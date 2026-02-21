# User Feature - Security & Authorization Documentation

## Overview

This document explains the decentralized role-based access control (RBAC) system implemented for the user feature.

---

## Architecture

### 1. **Authentication Layer**

- **Location**: `src/shared/auth/auth.middleware.ts`
- **Purpose**: Validates JWT tokens and authenticates requests
- **Middleware**: `requireAuth`

```typescript
// Usage: Apply to protected routes
router.get('/me', requireAuth, controller.getMe);
```

### 2. **Authorization Layer**

- **Location**: `src/shared/auth/role.middleware.ts`
- **Purpose**: Enriches requests with user roles and enforces role-based access control
- **Middleware**: `enrichUserRoles`, `requireRole`

```typescript
// Usage: Enforce admin-only access
router.post('/roles', requireAuth, enrichUserRoles, requireRole('admin'), controller.createRole);
```

---

## Role-Based Access Control (RBAC)

### Default Roles

- **admin**: Full system access, can manage users and roles
- **moderator**: Can moderate content
- **user**: Standard user permissions

### How It Works

1. **User Authentication**
   - User logs in with email/password
   - Receives JWT token with `sub` (user ID) and `email` claims

2. **Role Enrichment**
   - `enrichUserRoles` middleware fetches user's roles from database
   - Stores roles in `req.userRoles` array

3. **Authorization Check**
   - `requireRole('admin')` checks if user has required role
   - Returns 403 Forbidden if user lacks required role

### Request Flow

```
POST /api/users/roles
  ↓
requireAuth (validate token)
  ↓
enrichUserRoles (fetch user roles from DB)
  ↓
requireRole('admin') (check if user is admin)
  ↓
Controller handler
```

---

## Database Query Optimization

### Previous Implementation

- `findById()`: 2 queries (1 for user + 1 for roles)
- `findByEmail()`: 2 queries
- `findAll()`: N+1 queries (1 for users + N for each user's roles)

### New Implementation (Optimized)

All queries use SQL JOINs to fetch data in single query:

```typescript
// Single JOIN query instead of separate lookups
const rows = await db
  .select({
    /* user fields + roleName */
  })
  .from(users)
  .leftJoin(userRoles, eq(userRoles.userId, users.id))
  .leftJoin(roles, eq(roles.id, userRoles.roleId))
  .where(eq(users.id, id));
```

**Performance Improvement**: ~50-80% reduction in DB queries

---

## New Repository Methods

### `hasRole(userId: string, roleName: string): Promise<boolean>`

Check if user has specific role efficiently

```typescript
const isAdmin = await userRepo.hasRole(userId, 'admin');
```

### `getUserCount(): Promise<number>`

Get total user count (useful for admin dashboard)

```typescript
const totalUsers = await userRepo.getUserCount();
```

### `findById/findByEmail/findAll()`

Now returns users with roles in single query

---

## Route Security Structure

```
PUBLIC ROUTES (No authentication required)
├── POST   /auth/register
├── POST   /auth/login
└── POST   /auth/refresh

PROTECTED ROUTES (Authentication required)
├── GET    /me
├── PATCH  /me/profile
└── PATCH  /me/password

ADMIN ROUTES (Authentication + 'admin' role required)
├── GET    /users
├── POST   /roles
├── GET    /roles
├── GET    /users/:userId/roles
├── POST   /users/roles/assign
└── POST   /users/roles/remove
```

---

## Setting Up Admin User

### Step 1: Create roles

```bash
curl -X POST http://localhost:3000/api/users/roles \
  -H "Content-Type: application/json" \
  -d '{"name": "admin"}'
```

### Step 2: Register admin user

```bash
curl -X POST http://localhost:3000/api/users/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "securepassword"}'
```

### Step 3: Assign admin role

```bash
curl -X POST http://localhost:3000/api/users/users/roles/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{"userId": "<USER_ID>", "roleName": "admin"}'
```

---

## Best Practices

1. **Always use `requireAuth` before `requireRole`**

   ```typescript
   // ✅ Correct
   r.post('/admin', requireAuth, enrichUserRoles, requireRole('admin'), handler);

   // ❌ Wrong
   r.post('/admin', requireRole('admin'), handler);
   ```

2. **Use specific, descriptive role names**

   ```typescript
   // Good roles
   ('admin', 'moderator', 'user', 'content-creator', 'viewer');

   // Avoid ambiguous names
   ('superuser', 'vip', 'power-user');
   ```

3. **Check roles at the route level, not inside handlers**

   ```typescript
   // ✅ Preferred
   r.post('/admin', requireRole('admin'), handler);

   // ⚠️ Acceptable but less clean
   if (!userRoles.includes('admin')) {
     throw new ForbiddenError();
   }
   ```

4. **Use `hasRole()` for conditional logic inside handlers**
   ```typescript
   if (await userRepo.hasRole(userId, 'admin')) {
     // Grant special access
   }
   ```

---

## Error Handling

### 401 Unauthorized

- Missing or invalid JWT token
- Expired token

### 403 Forbidden

- User authenticated but lacks required role
- Example: Regular user trying to access admin endpoints

```json
{
  "success": false,
  "code": "FORBIDDEN",
  "message": "Requires one of these roles: admin"
}
```

---

## Testing Authorization

### Add Admin Role

```bash
npm run dev
# In another terminal:
curl -X POST http://localhost:3000/api/users/roles \
  -H "Content-Type: application/json" \
  -d '{"name": "admin"}'
```

### Test Protected Endpoint

```bash
# Get token
TOKEN=$(curl -X POST http://localhost:3000/api/users/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password"}' | jq -r '.data.accessToken')

# Access protected route
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/users/me
```

---

## Security Considerations

1. **Token Security**
   - Tokens stored in memory only (not in localStorage for SPAs)
   - Use different secrets for access and refresh tokens
   - Set reasonable expiration times

2. **Role Enumeration**
   - Current implementation returns role names in responses
   - Consider encryption for sensitive role names if needed

3. **Database Indexes**
   - Ensure indexes exist on frequently queried columns:
     - `User.email` (already indexed)
     - `Role.name` (should be indexed)
     - `UserRole.userId` (should be indexed)

4. **Rate Limiting**
   - Implement rate limiting on auth endpoints
   - Prevent brute force attacks

---

## Migration Guide

If upgrading from old implementation:

1. Update all routes to use new middleware structure
2. Initialize default roles: `new InitializeRolesUseCase(roleRepo).execute()`
3. Assign admin role to existing admins
4. Test all endpoints with different role levels

---

## Future Enhancements

- [ ] Permission-based access control (PBAC)
- [ ] Role inheritance hierarchies
- [ ] Audit logging for role changes
- [ ] Time-limited role assignments
- [ ] Role-based field-level access control
