# Quick Start Guide - Role-Based Authorization System

## Setup (5 minutes)

### 1. Start the server

```bash
npm run dev
```

### 2. Create default roles

```bash
curl -X POST http://localhost:3000/api/users/roles \
  -H "Content-Type: application/json" \
  -d '{"name": "admin"}'

curl -X POST http://localhost:3000/api/users/roles \
  -H "Content-Type: application/json" \
  -d '{"name": "moderator"}'

curl -X POST http://localhost:3000/api/users/roles \
  -H "Content-Type: application/json" \
  -d '{"name": "user"}'
```

Or use the initializer:

```typescript
import { PgRoleRepository } from './modules/user/infrastructure/role.repo.pg';
import { InitializeRolesUseCase } from './modules/user/application/initialize-roles.usecase';

const roleRepo = new PgRoleRepository();
const initRoles = new InitializeRolesUseCase(roleRepo);
await initRoles.execute();
```

### 3. Create admin user

```bash
curl -X POST http://localhost:3000/api/users/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePassword123"
  }'
```

Save the user ID from the response.

### 4. Assign admin role

```bash
# First get the admin token
ADMIN_TOKEN=$(curl -s -X POST http://localhost:3000/api/users/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePassword123"
  }' | jq -r '.data.accessToken')

# Then assign the admin role
curl -X POST http://localhost:3000/api/users/users/roles/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "userId": "YOUR_ADMIN_USER_ID",
    "roleName": "admin"
  }'
```

---

## Common Operations

### Login User

```bash
curl -X POST http://localhost:3000/api/users/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Get Current User Profile

```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### List All Users (Admin Only)

```bash
curl -X GET http://localhost:3000/api/users/users \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### Get User Roles

```bash
curl -X GET http://localhost:3000/api/users/users/{userId}/roles \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### Assign Role to User

```bash
curl -X POST http://localhost:3000/api/users/users/roles/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "userId": "target-user-id",
    "roleName": "moderator"
  }'
```

### Remove Role from User

```bash
curl -X POST http://localhost:3000/api/users/users/roles/remove \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "userId": "target-user-id",
    "roleName": "moderator"
  }'
```

### Update User Profile

```bash
curl -X PATCH http://localhost:3000/api/users/me/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{
    "displayName": "John Doe",
    "username": "johndoe"
  }'
```

### Change Password

```bash
curl -X PATCH http://localhost:3000/api/users/me/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{
    "oldPassword": "oldpass123",
    "newPassword": "newpass123"
  }'
```

---

## Frontend Integration

### Store Token

```typescript
// After login, store tokens securely
const response = await fetch('http://localhost:3000/api/users/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});

const { accessToken, refreshToken } = await response.json();

// Store in memory (best) or secure storage
sessionStorage.setItem('accessToken', accessToken);
sessionStorage.setItem('refreshToken', refreshToken);
```

### Add Token to Requests

```typescript
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
};

const response = await fetch('http://localhost:3000/api/users/me', {
  method: 'GET',
  headers,
});
```

### Handle 401/403 Responses

```typescript
async function makeRequest(url, options = {}) {
  const token = localStorage.getItem('accessToken');
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // Token expired, try refresh
    const newToken = await refreshToken();
    if (newToken) {
      headers.Authorization = `Bearer ${newToken}`;
      response = await fetch(url, { ...options, headers });
    } else {
      // Refresh failed, redirect to login
      window.location.href = '/login';
    }
  }

  if (response.status === 403) {
    // Insufficient permissions
    throw new Error('You do not have permission to perform this action');
  }

  return response;
}
```

### Conditional UI Based on Roles

```typescript
// Assuming roles are stored after login
useEffect(() => {
  const user = getCurrentUser();
  const isAdmin = user.roles.includes('admin');

  if (isAdmin) {
    // Show admin panel
    showAdminDashboard();
  } else {
    // Show user panel
    showUserDashboard();
  }
}, []);
```

---

## Troubleshooting

### Error: "UNAUTHORIZED: Login required"

- **Cause**: Missing or invalid Authorization header
- **Fix**: Ensure token is included in header: `Authorization: Bearer <token>`

### Error: "UNAUTHORIZED: Invalid token"

- **Cause**: Token is expired or malformed
- **Fix**: Login again to get new token, or use refresh endpoint

### Error: "FORBIDDEN: Requires one of these roles: admin"

- **Cause**: User doesn't have required role
- **Fix**: Admin must assign the role using the assign endpoint

### Roles not showing up

- **Cause**: enrichUserRoles middleware not in route stack
- **Fix**: Ensure `enrichUserRoles` middleware is applied before `requireRole`

### Database connection error

- **Cause**: PostgreSQL not running or connection string invalid
- **Fix**: Check `.env` file and ensure PostgreSQL container is running

---

## Environment Variables

Required in `.env`:

```env
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-different-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

---

## Testing Script

Run included test script:

```bash
bash scripts/test-rbac.sh
```

This will:

1. Create all default roles
2. Register two test users (admin and regular)
3. Assign admin role to first user
4. Test all endpoints with both users
5. Verify authorization works correctly

---

## Architecture Overview

```
Request
  ↓
Express Router
  ↓
Middleware Stack:
  1. Body Parser (built-in)
  2. requireAuth (validate JWT)
  3. enrichUserRoles (fetch roles from DB)
  4. requireRole (check roles)
  ↓
Route Handler (Controller)
  ↓
Use Case (Business Logic)
  ↓
Repository (Data Access)
  ↓
PostgreSQL Database
  ↓
Response
```

---

## Key Files

- `src/shared/auth/auth.middleware.ts` - Authentication logic
- `src/shared/auth/role.middleware.ts` - Role enrichment
- `src/modules/user/interface/user.routes.ts` - Protected routes
- `src/modules/user/infrastructure/user.repo.pg.ts` - Database queries
- `SECURITY_RBAC.md` - Detailed security documentation
- `AUTHORIZATION_DIAGRAMS.md` - Visual flow diagrams

---

## Support

For detailed information, see:

- **Full Documentation**: `SECURITY_RBAC.md`
- **Architecture Diagrams**: `AUTHORIZATION_DIAGRAMS.md`
- **Implementation Summary**: `USER_FEATURE_SUMMARY.md`
