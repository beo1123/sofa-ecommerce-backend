# Sofa E-Commerce Backend

Backend Node.js production-grade cho hệ thống e-commerce.

- Node.js 18 (CommonJS)
- Express (chỉ làm transport)
- PostgreSQL (raw SQL, không ORM)
- Redis (cache + BullMQ)
- JWT Auth (bcrypt + jsonwebtoken)
- Transaction-safe Order (SELECT ... FOR UPDATE)
- Structured logging (pino)
- Docker + Migration on boot
- Integration Test + CI

---

## 1. Architecture

    HTTP
      │
      ▼
    Routes (Express)
      │
      ▼
    Controllers (validate + map input)
      │
      ▼
    Services (business logic + raw SQL)
      │
      ├── PostgreSQL (pg + sql-template-strings)
      ├── Redis (cache-aside)
      └── BullMQ (background jobs)

Nguyên tắc:

- Express = transport only
- Không ORM
- Mọi query đều là prepared statements
- Business logic nằm trong Service
- Transaction chuẩn với `BEGIN / COMMIT / ROLLBACK`
- Inventory dùng `SELECT … FOR UPDATE` để tránh race-condition

---

## 2. Environment Variables

`.env`

```env
NODE_ENV=development
PORT=3000

DATABASE_URL=postgres://postgres:postgres@localhost:5433/app
REDIS_URL=redis://localhost:6379

JWT_SECRET=dev-secret
JWT_EXPIRES_IN=7d
```

---

## 3. Development Mode (DEV -- dùng Postman)

Mục tiêu: - DB + Redis chạy bằng Docker - Node chạy trực tiếp trên máy -
Mỗi lần sửa code → reload ngay - Test API bằng Postman

### Bước 1 -- Chạy DB + Redis

```bash
docker compose up db redis
```

### Bước 2 -- Chạy API local

```bash
npm install
npm run dev
```

Server chạy ở:

    http://localhost:3000

---

## 4. Test bằng Postman

### Health

    GET http://localhost:3000/api/health

### Product

    GET http://localhost:3000/api/products
    GET http://localhost:3000/api/products/modern-sofa

### Auth

    POST /api/auth/register
    POST /api/auth/login

### Create Order

    POST /api/orders

---

## 5. Production Mode (Docker)

```bash
docker compose up --build
```

Containers:

- app -- API server
- worker -- BullMQ worker
- db -- Postgres
- redis -- Redis

---

## 6. Worker (BullMQ)

Queue: `order-events`

API không bị block bởi email / webhook.

---

## 7. Testing

```bash
npm test
```

---

## 8. CI

GitHub Actions:

- Spin Postgres + Redis
- Run migrate
- Run tests

---

## 9. Mục tiêu đạt được

- Backend e-commerce thực thụ
- Không ORM
- Transaction-safe
- Có auth, cache, queue
- Có test + CI
- Có dev workflow chuẩn
- Có prod workflow chuẩn
