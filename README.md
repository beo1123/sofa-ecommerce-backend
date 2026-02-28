# Sofa E-Commerce Backend

A modern, scalable Node.js backend for an e-commerce platform with comprehensive features including user authentication, role-based access control (RBAC), product management, and order processing.

## 🏗️ Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

```
src/
├── modules/
│   ├── user/              # User authentication & authorization
│   │   ├── domain/        # Entities & interfaces
│   │   ├── application/   # Use cases & business logic
│   │   ├── infrastructure/# Repository implementations
│   │   └── interface/     # Controllers & HTTP routes
│   │
│   ├── category/          # Product categories
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── interface/
│   │
│   ├── product/           # Products & variants
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── interface/
│   │
│   └── [other modules...]
│
└── shared/                # Cross-cutting concerns
    ├── auth/              # JWT, middleware
    ├── db/                # Database setup, schema
    ├── errors/            # Custom error classes
    └── http/              # HTTP utilities, response formatting
```

### Design Patterns

- **Repository Pattern**: Abstracts database access
- **Use Case Pattern**: Encapsulates business logic
- **Dependency Injection**: Explicit dependencies in constructors
- **Error Handling**: Custom domain-specific exceptions

## 🛠️ Tech Stack

| Layer                 | Technology       |
| --------------------- | ---------------- |
| **Runtime**           | Node.js 18+      |
| **Language**          | TypeScript       |
| **Framework**         | Express.js 5.x   |
| **ORM**               | Drizzle ORM      |
| **Database**          | PostgreSQL       |
| **Authentication**    | JWT + bcrypt     |
| **Validation**        | Zod              |
| **API Documentation** | Swagger/OpenAPI  |
| **Security**          | Helmet, CORS     |
| **Code Quality**      | ESLint, Prettier |

## 📦 Installation

### Prerequisites

- Node.js 18 or higher
- Docker & Docker Compose (for PostgreSQL)
- npm or yarn

### Setup

1. **Clone and install**

   ```bash
   git clone <repository>
   cd sofa-ecommerce-backend
   npm install
   ```

2. **Start PostgreSQL with Docker**

   ```bash
   docker-compose up -d
   ```

3. **Run database migrations**

   ```bash
   npm run migrate
   ```

4. **Create `.env` file** (copy from `.env.example`)

   ```bash
   cp .env.example .env
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

Server runs on `http://localhost:3000`

## 🚀 Core Features

### 1. **User Management & Authentication**

- User registration with email/password
- JWT-based authentication (access + refresh tokens)
- Password hashing with bcrypt
- Profile management
- Password change

### 2. **Role-Based Access Control (RBAC)**

- Built-in roles: `admin`, `moderator`, `user`
- Flexible role assignment/removal
- Admin-only endpoints protection
- User roles tracking

### 3. **Product Management**

- Create, read, update, delete products
- Product variants (colors, sizes, materials)
- Product images (primary + gallery)
- Inventory tracking
- Slug-based URLs

### 4. **Category Management**

- Category CRUD operations
- Hierarchical organization
- Public listing
- Admin-only modifications

### 5. **Orders & Order Management**

- Order creation with items
- Order status tracking
- Shipping/billing addresses
- Order history
- Status change history

### 6. **Additional Features**

- Coupons and discounts
- Product reviews & ratings
- Wishlist functionality
- Return requests & refunds
- Payment metadata tracking
- Article/blog management
- Audit logging

## 📚 API Documentation

Interactive API documentation available at:

```
http://localhost:3000/docs
```

### Key Endpoints

#### Authentication (Public)

```
POST   /api/v1/users/auth/register        Register new user
POST   /api/v1/users/auth/login            Login with credentials
POST   /api/v1/users/auth/refresh          Refresh access token
```

#### User Profile (Protected)

```
GET    /api/v1/users/me                    Get current user
PATCH  /api/v1/users/me/profile            Update profile
PATCH  /api/v1/users/me/password           Change password
```

#### User Management (Admin Only)

```
GET    /api/v1/users/users                 List all users
POST   /api/v1/users/roles                 Create role
GET    /api/v1/users/roles                 List roles
GET    /api/v1/users/users/:userId/roles   Get user roles
POST   /api/v1/users/users/roles/assign    Assign role to user
POST   /api/v1/users/users/roles/remove    Remove role from user
```

#### Categories (Public Read, Admin Write)

```
GET    /api/v1/categories                  List categories
GET    /api/v1/categories/:id              Get category by ID
GET    /api/v1/categories/by-slug/:slug    Get category by slug
POST   /api/v1/categories                  Create category (admin)
PATCH  /api/v1/categories/:id              Update category (admin)
DELETE /api/v1/categories/:id              Delete category (admin)
```

---

## 🔄 Database Seeding & Mock Data

The optional seed script is still available (`npm run seed`) but it is no longer
required for normal development. Most developers can skip this step and create
any test data via the HTTP API or migrations instead.

1. Make sure your PostgreSQL container is running (`docker-compose up -d`).
2. Run migrations if you haven't already:

   ```bash
   npm run migrate
   ```

> The seed script lives at `src/shared/db/seed.ts` and will wipe+insert
> sample categories, a product with a variant, and default roles if you choose
> to run it.

> **Manual SQL alternative**
>
> If you prefer raw SQL, the following statements perform the same actions:
>
> ```sql
> TRUNCATE "UserRole", "Role", "User", "Inventory", "ProductVariant",
>          "ProductImage", "Product", "Category" CASCADE;
>
> INSERT INTO "Role" (id, name) VALUES
>   (gen_random_uuid(), 'admin'),
>   (gen_random_uuid(), 'user');
>
> -- hash a password separately, then insert user & assign role
> ```

The seeded mock data is lightweight and easily extendable – feel free to
update the script or add additional `INSERT`/`db.insert` calls when you need
more realistic samples for development or testing.

---

#### Products

```
# public store API
GET    /api/v1/products                    List or search products (supports query params page, perPage, category, q, priceMin, priceMax, color, material, sort)
GET    /api/v1/products/by-slug/:slug      Get product by slug
GET    /api/v1/products/related/:slug      Related products (max 4)
GET    /api/v1/products/search             Alias for list (use q param)
GET    /api/v1/products/best-selling       Top sellers
GET    /api/v1/products/featured           Featured items
GET    /api/v1/products/filters            Available filters (materials/colors/prices)

# admin management (requires JWT + admin role)
POST   /api/v1/products                    Create product
GET    /api/v1/products/:id                Get product by id
PATCH  /api/v1/products/:id                Update product
DELETE /api/v1/products/:id                Delete product
# image management
POST   /api/v1/products/:id/images         Add image to product
DELETE /api/v1/products/images/:imageId    Remove image
PATCH  /api/v1/products/:id/images/:imageId/primary   Set primary image
# variant & inventory
POST   /api/v1/products/:id/variants       Add variant
PATCH  /api/v1/products/variants/:variantId    Update variant
PATCH  /api/v1/products/variants/:variantId/inventory   Update inventory counts
```

## 🔐 Authentication & Authorization

### JWT Strategy

Two types of tokens:

- **Access Token** (15 minutes): Used for API requests
- **Refresh Token** (7 days): Used to get new access token

### Protected Routes

Add `Authorization: Bearer <token>` header:

```bash
curl -H "Authorization: Bearer eyJhbGc..." http://localhost:3000/api/v1/users/me
```

### Role-Based Access Control

Routes can require specific roles:

```typescript
// In routes
r.use(requireRole('admin')); // Only admins can access following routes
```

Current roles:

- `admin`: Full system access
- `moderator`: Content moderation
- `user`: Regular user permissions

## 📋 Environment Variables

Create `.env` file with:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/sofa_db

# JWT
JWT_ACCESS_SECRET=your-secret-key-min-32-chars-recommended
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars

# Optional
LOG_LEVEL=info
```

## 🧰 Development Commands

```bash
# Start development server (with hot reload)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run production build
npm start

# Run database migration
npm run migrate

# Lint code
npm run lint

# Format code
npm run format
```

## 📊 Database Schema

Key tables:

- `User` - User accounts
- `Role` - Role definitions
- `UserRole` - User to role mapping
- `Category` - Product categories
- `Product` - Product listings
- `ProductVariant` - Product variations
- `ProductImage` - Product images
- `Inventory` - Stock tracking
- `Order` - Customer orders
- `OrderItem` - Order line items
- `Address` - Shipping/billing addresses
- `Review` - Product reviews
- `Coupon` - Discount codes
- `Article` - Blog articles
- And more...

See [001_init.sql](./src/db/migrations/001_init.sql) for complete schema.

## 🔍 Project Structure Details

### Use Cases (Business Logic)

Each use case is a class with a single `execute()` method:

```typescript
class CreateProductUseCase {
  constructor(private productRepo: ProductRepository) {}

  async execute(input: CreateProductInput): Promise<CreateProductOutput> {
    // Validate input
    // Business logic
    // Persist via repository
    // Return result
  }
}
```

### Controllers

Handle HTTP requests/responses with validation:

```typescript
class ProductController extends BaseController {
  async create(req: Request, res: Response) {
    const input = schema.parse(req.body); // Zod validation
    const result = await this.createUC.execute(input);
    res.status(201).json(ok(result));
  }
}
```

### Error Handling

Custom error hierarchy for domain-specific exceptions:

```typescript
-DomainError(base) - NotFoundError - ConflictError - UnauthorizedError - ValidationError;
```

Caught by global error handler returning consistent error responses.

## 📖 Additional Documentation

- [Quick Start Guide](./QUICK_START.md) - Get up and running quickly
- [Security & RBAC Details](./SECURITY_RBAC.md) - Security architecture
- [Authorization Diagrams](./AUTHORIZATION_DIAGRAMS.md) - Visual authorization flows
- [User Feature Summary](./USER_FEATURE_SUMMARY.md) - Complete user features

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Code with TypeScript & follow clean architecture
3. Lint & format: `npm run format && npm run lint`
4. Commit changes: `git commit -am 'feat: add feature'`
5. Push & create pull request

## 📝 Coding Standards

- **Language**: TypeScript with strict mode
- **Formatting**: Prettier (auto-format on commit)
- **Linting**: ESLint
- **Naming**: camelCase for variables/functions, PascalCase for classes
- **Files**: OneClass/OneInterface per file
- **Imports**: Absolute imports from module roots

## 🐛 Debugging

Enable debug logging:

```bash
LOG_LEVEL=debug npm run dev
```

View PostgreSQL logs:

```bash
docker-compose logs postgres
```

## 📄 License

Proprietary - All rights reserved

## 👥 Support

For issues or questions, contact the development team or create an issue in the repository.

---

**Last Updated**: February 21, 2026  
**Node Version**: 18+  
**Status**: Active Development
