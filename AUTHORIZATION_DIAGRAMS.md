# Role-Based Authorization Flow Diagrams

## 1. Authentication & Authorization Flow

```
┌─────────────────┐
│   Client        │
│  (Frontend)     │
└────────┬────────┘
         │
         │ 1. POST /auth/login
         │    {email, password}
         │
         v
┌─────────────────────────────┐
│   Public Auth Endpoint      │
│ (No req.user yet)           │
└────────┬────────────────────┘
         │
         │ Validate credentials
         │ Generate JWT token
         │
         v
┌─────────────────────────────┐
│  Client receives JWT        │
│  accessToken + refreshToken │
└────────┬────────────────────┘
         │
         │ 2. GET /api/users/users
         │    Authorization: Bearer <token>
         │
         v
┌──────────────────────────────┐
│   requireAuth Middleware     │
│  ✓ Parse Bearer token       │
│  ✓ Verify JWT signature     │
│  ✓ Extract claims (sub, email)
│  ✓ Set req.user            │
└────────┬─────────────────────┘
         │
         │ if token invalid → 401 Unauthorized
         │
         v
┌──────────────────────────────┐
│  enrichUserRoles Middleware  │
│  ✓ Get req.user.sub (userID)│
│  ✓ Query: SELECT roles      │
│  ✓ Set req.userRoles = [...]│
└────────┬─────────────────────┘
         │
         │ Roles fetched from DB
         │ req.userRoles = ['admin']
         │
         v
┌──────────────────────────────┐
│ requireRole('admin')         │
│ Middleware                   │
│                              │
│ Check: 'admin' in           │
│        req.userRoles?       │
└────────┬─────────────────────┘
         │
         ├─ if YES → continue to handler ─→ 200 OK
         │
         └─ if NO  → return 403 Forbidden
                      "Requires one of these roles: admin"
```

---

## 2. Role Assignment Process

```
Admin User (with 'admin' role)
        │
        │ POST /users/roles/assign
        │ {userId, roleName: 'moderator'}
        │
        v
┌─────────────────────────────┐
│  assignRole Controller      │
│  ✓ Validate input          │
│  ✓ Parse userId + roleName │
└────────┬────────────────────┘
         │
         v
┌─────────────────────────────┐
│  AssignRoleUseCase          │
│  ✓ Find user by ID         │
│  ✓ Find role by name        │
│  ✓ Call repo.assignRole()   │
└────────┬────────────────────┘
         │
         v
┌─────────────────────────────┐
│  PgUserRepository           │
│  INSERT INTO UserRole       │
│    (userId, roleId)         │
│  ON CONFLICT DO NOTHING     │
└────────┬────────────────────┘
         │
         v
┌─────────────────────────────┐
│  PostgreSQL Database        │
│  userRoles table updated    │
└────────┬────────────────────┘
         │
         v
┌─────────────────────────────┐
│  User now has role          │
│  enrichUserRoles will fetch │
│  updated roles on next req  │
└─────────────────────────────┘
```

---

## 3. Database Query Optimization

### Before (Multiple Queries)

```
findById('user-123')

Query 1: SELECT * FROM "User" WHERE id = 'user-123'
         Result: { id, email, password, displayName, ... }

Query 2: SELECT r.name FROM "UserRole" ur
         INNER JOIN "Role" r ON ur.roleId = r.id
         WHERE ur.userId = 'user-123'
         Result: [{ name: 'admin' }, { name: 'moderator' }]

Total: 2 database round-trips
```

### After (Single JOIN Query)

```
findById('user-123')

Query 1: SELECT u.id, u.email, u.password, ..., r.name as roleName
         FROM "User" u
         LEFT JOIN "UserRole" ur ON ur.userId = u.id
         LEFT JOIN "Role" r ON r.id = ur.roleId
         WHERE u.id = 'user-123'

         Result: [
           { id, email, password, ..., roleName: 'admin' },
           { id, email, password, ..., roleName: 'moderator' },
           { id, email, password, ..., roleName: null }
         ]

         Application code:
         - Extract user from first row
         - Collect unique roles: ['admin', 'moderator']

Total: 1 database round-trip ✓ 50-80% faster
```

---

## 4. Middleware Stack Architecture

```
┌───────────────────────────────────────────────────┐
│  Express.js Router                                 │
└────────────────┬────────────────────────────────────┘
                 │
        Public Routes
        │ (No middleware)
        │
        ├─ POST /auth/register
        ├─ POST /auth/login
        └─ POST /auth/refresh
                 │
                 v
        Protected Routes
        │ (requireAuth middleware)
        │
        ├─ GET /me
        ├─ PATCH /me/profile
        └─ PATCH /me/password
                 │
                 v
        Admin Routes
        │ (requireAuth → enrichUserRoles → requireRole('admin'))
        │
        ├─ GET /users
        ├─ POST /roles
        ├─ GET /roles
        ├─ GET /users/:userId/roles
        ├─ POST /users/roles/assign
        └─ POST /users/roles/remove

Middleware Execution Order (for Admin Routes):
┌─────────────────────────────────────────┐
│ 1. requireAuth                          │
│    ├─ Parse Authorization header       │
│    ├─ Verify JWT token                 │
│    └─ Set req.user = { sub, email }   │
├─────────────────────────────────────────┤
│ 2. enrichUserRoles                      │
│    ├─ Get user roles from DB (1 query) │
│    └─ Set req.userRoles = [...]        │
├─────────────────────────────────────────┤
│ 3. requireRole('admin')                 │
│    ├─ Check if 'admin' in req.userRoles│
│    └─ Allow/Deny based on role         │
├─────────────────────────────────────────┤
│ 4. Route Handler                        │
│    └─ Execute business logic            │
└─────────────────────────────────────────┘
```

---

## 5. Complete Request Lifecycle

```
Client Request
    │
    ├─ Headers: { Authorization: "Bearer eyJhbGc..." }
    ├─ Method: GET
    └─ URL: /api/users/users
            │
            v
         Express Router
            │
            ├─ Matches route? YES
            │
            v
         Middleware Chain
            │
            ├─ 1. app.use(express.json()) - Parse JSON
            │
            ├─ 2. requireAuth
            │     ├─ Has bearer token? YES
            │     ├─ Token valid? YES
            │     └─ req.user = { sub: 'uuid', email: 'user@...' }
            │
            ├─ 3. enrichUserRoles
            │     ├─ Query: SELECT role names WHERE userId = req.user.sub
            │     └─ req.userRoles = ['admin', 'moderator']
            │
            ├─ 4. requireRole('admin')
            │     ├─ 'admin' in req.userRoles? YES
            │     └─ Allow access
            │
            v
         Route Handler (Controller)
            │
            ├─ listUsers()
            │   ├─ Call GetUsersUseCase
            │   ├─ Query all users with roles
            │   └─ res.json(ok(users))
            │
            v
         Response
            │
            ├─ Status: 200 OK
            ├─ Body: { success: true, data: [...] }
            │
            v
         Client
```

---

## 6. Error Handling Flow

```
Request with Issues
    │
    ├─ No Authorization header
    │  └─ requireAuth returns 401 ✗
    │     "UNAUTHORIZED: Login required"
    │
    ├─ Expired/Invalid token
    │  └─ requireAuth returns 401 ✗
    │     "UNAUTHORIZED: Invalid token"
    │
    ├─ User exists but no roles
    │  ├─ requireAuth: PASS ✓
    │  ├─ enrichUserRoles: req.userRoles = []
    │  ├─ requireRole('admin'): 'admin' not in []
    │  └─ Returns 403 ✗
    │     "FORBIDDEN: Requires one of these roles: admin"
    │
    ├─ User not found in token
    │  └─ enrichUserRoles catches error
    │     Sets req.userRoles = [] (fallback)
    │     requireRole returns 403 ✗
    │
    └─ Valid admin access
       ├─ requireAuth: PASS ✓
       ├─ enrichUserRoles: PASS ✓ (req.userRoles = ['admin'])
       ├─ requireRole('admin'): PASS ✓
       └─ Handler executes, returns 200 ✓
```

---

## 7. Role Hierarchy (Example Extension)

```
Current Implementation (Flat):
┌──────────────────────────────┐
│  Available Roles             │
├──────────────────────────────┤
│  • admin                     │
│  • moderator                 │
│  • user                      │
└──────────────────────────────┘

Future: Role Hierarchy (Could be extended)
┌──────────────────────────────┐
│        super_admin           │
│            │                 │
│    ┌───────┴────────┐        │
│    │                │        │
│  admin          moderator   │
│    │                │        │
│    └───────┬────────┘        │
│            │                 │
│          user                │
│                              │
│ • super_admin has all perms │
│ • admin can moderate        │
│ • user has basic access     │
└──────────────────────────────┘

Implementation: hasRole() could check hierarchy
```
