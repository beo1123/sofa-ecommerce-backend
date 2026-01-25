-- FILE: src/db/migrations/001_init.sql
-- MIGRATION: 001_init.sql
-- GENERATED FROM PRISMA SCHEMA (UUID VERSION)
-- Node.js 18 – PostgreSQL DDL, idempotent

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================
-- USERS & AUTH
-- =========================================================

CREATE TABLE IF NOT EXISTS "User" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    username TEXT UNIQUE,
    password TEXT,
    "displayName" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "lastLogin" TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS "idx_user_email" ON "User"(email);

CREATE TABLE IF NOT EXISTS "Role" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "UserRole" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "roleId" UUID NOT NULL REFERENCES "Role"(id) ON DELETE CASCADE,
    CONSTRAINT "uq_user_role" UNIQUE ("userId", "roleId")
);

CREATE INDEX IF NOT EXISTS "idx_userrole_role" ON "UserRole"("roleId");

-- =========================================================
-- CATEGORIES & PRODUCTS
-- =========================================================

CREATE TABLE IF NOT EXISTS "Category" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    image TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_category_name" ON "Category"(name);

CREATE TABLE IF NOT EXISTS "Product" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    "shortDescription" TEXT,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'PUBLISHED',
    metadata JSONB,
    "categoryId" UUID REFERENCES "Category"(id),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_product_slug" ON "Product"(slug);
CREATE INDEX IF NOT EXISTS "idx_product_status" ON "Product"(status);
CREATE INDEX IF NOT EXISTS "idx_product_createdAt" ON "Product"("createdAt");
CREATE INDEX IF NOT EXISTS "idx_product_category" ON "Product"("categoryId");
CREATE INDEX IF NOT EXISTS "idx_product_published" ON "Product"("createdAt" DESC) WHERE status = 'PUBLISHED';

CREATE TABLE IF NOT EXISTS "ProductImage" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    alt TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "productId" UUID NOT NULL REFERENCES "Product"(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_productimage_product" ON "ProductImage"("productId");

CREATE TABLE IF NOT EXISTS "ProductVariant" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "productId" UUID NOT NULL REFERENCES "Product"(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    "skuPrefix" TEXT,
    "colorCode" TEXT,
    "colorName" TEXT,
    material TEXT,
    price DECIMAL(12,2) NOT NULL,
    "compareAtPrice" DECIMAL(12,2),
    image TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_variant_product" ON "ProductVariant"("productId");
CREATE INDEX IF NOT EXISTS "idx_variant_name" ON "ProductVariant"(name);
CREATE INDEX IF NOT EXISTS "idx_variant_color" ON "ProductVariant"("colorName");
CREATE INDEX IF NOT EXISTS "idx_variant_material" ON "ProductVariant"(material);

CREATE TABLE IF NOT EXISTS "Inventory" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku TEXT NOT NULL UNIQUE,
    "variantId" UUID NOT NULL REFERENCES "ProductVariant"(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 0,
    reserved INT NOT NULL DEFAULT 0,
    location TEXT,
    metadata JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_inventory_sku" ON "Inventory"(sku);
CREATE INDEX IF NOT EXISTS "idx_inventory_variant" ON "Inventory"("variantId");

-- =========================================================
-- ADDRESS
-- =========================================================

CREATE TABLE IF NOT EXISTS "Address" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID REFERENCES "User"(id),
    "fullName" TEXT NOT NULL,
    line1 TEXT NOT NULL,
    line2 TEXT,
    city TEXT NOT NULL,
    province TEXT,
    "postalCode" TEXT,
    country TEXT NOT NULL,
    phone TEXT,
    metadata JSONB,
    "isDefaultShipping" BOOLEAN NOT NULL DEFAULT false,
    "isDefaultBilling" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_address_user" ON "Address"("userId");

-- =========================================================
-- ORDERS
-- =========================================================

CREATE TABLE IF NOT EXISTS "Order" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "orderNumber" TEXT NOT NULL UNIQUE,
    "userId" UUID REFERENCES "User"(id),
    "shippingAddressId" UUID REFERENCES "Address"(id),
    "billingAddressId" UUID REFERENCES "Address"(id),
    "recipientName" TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    line1 TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'TPHCM',
    province TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'Việt Nam',
    status TEXT NOT NULL DEFAULT 'CREATED',
    subtotal DECIMAL(12,2) NOT NULL,
    shipping DECIMAL(12,2) NOT NULL DEFAULT 0,
    tax DECIMAL(12,2) NOT NULL DEFAULT 0,
    total DECIMAL(12,2) NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "couponId" UUID,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_order_user" ON "Order"("userId");
CREATE INDEX IF NOT EXISTS "idx_order_status" ON "Order"(status);
CREATE INDEX IF NOT EXISTS "idx_order_created" ON "Order"("createdAt");

CREATE TABLE IF NOT EXISTS "OrderItem" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "orderId" UUID NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
    "productId" UUID REFERENCES "Product"(id),
    "variantId" UUID REFERENCES "ProductVariant"(id),
    sku TEXT,
    name TEXT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    quantity INT NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    returned BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_orderitem_order" ON "OrderItem"("orderId");
CREATE INDEX IF NOT EXISTS "idx_orderitem_product" ON "OrderItem"("productId");

CREATE TABLE IF NOT EXISTS "OrderStatusHistory" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "orderId" UUID NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
    "fromStatus" TEXT,
    "toStatus" TEXT NOT NULL,
    note TEXT,
    "actorId" UUID REFERENCES "User"(id),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_orderstatushistory_order" ON "OrderStatusHistory"("orderId");
CREATE INDEX IF NOT EXISTS "idx_orderstatushistory_to" ON "OrderStatusHistory"("toStatus");

-- =========================================================
-- COUPON
-- =========================================================

CREATE TABLE IF NOT EXISTS "Coupon" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
    amount DECIMAL(12,2),
    percent INT,
    description TEXT,
    "startsAt" TIMESTAMPTZ,
    "expiresAt" TIMESTAMPTZ,
    "usageLimit" INT,
    "usagePerUser" INT,
    "timesUsed" INT NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT true,
    metadata JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_coupon_code" ON "Coupon"(code);

-- =========================================================
-- REVIEWS
-- =========================================================

CREATE TABLE IF NOT EXISTS "Review" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID REFERENCES "User"(id),
    "productId" UUID NOT NULL REFERENCES "Product"(id) ON DELETE CASCADE,
    rating INT NOT NULL,
    title TEXT,
    body TEXT,
    approved BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT "uq_review_user_product" UNIQUE ("userId", "productId")
);

CREATE INDEX IF NOT EXISTS "idx_review_product" ON "Review"("productId");
CREATE INDEX IF NOT EXISTS "idx_review_user" ON "Review"("userId");

-- =========================================================
-- WISHLIST
-- =========================================================

CREATE TABLE IF NOT EXISTS "Wishlist" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL UNIQUE REFERENCES "User"(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "WishlistItem" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "wishlistId" UUID NOT NULL REFERENCES "Wishlist"(id) ON DELETE CASCADE,
    "productId" UUID NOT NULL REFERENCES "Product"(id) ON DELETE CASCADE,
    "variantId" UUID,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT "uq_wishlist_item" UNIQUE ("wishlistId", "productId", "variantId")
);

CREATE INDEX IF NOT EXISTS "idx_wishlist_product" ON "WishlistItem"("productId");

-- =========================================================
-- AUDIT LOG
-- =========================================================

CREATE TABLE IF NOT EXISTS "AuditLog" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "actorId" UUID REFERENCES "User"(id),
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    "entityId" TEXT,
    changes JSONB,
    ip TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_audit_actor" ON "AuditLog"("actorId");
CREATE INDEX IF NOT EXISTS "idx_audit_entity" ON "AuditLog"(entity, "entityId");

-- =========================================================
-- RETURNS & REFUNDS
-- =========================================================

CREATE TABLE IF NOT EXISTS "ReturnRequest" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "orderId" UUID NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
    "orderItemId" UUID NOT NULL REFERENCES "OrderItem"(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    evidence JSONB,
    "requestedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "processedAt" TIMESTAMPTZ,
    metadata JSONB
);

CREATE INDEX IF NOT EXISTS "idx_return_status" ON "ReturnRequest"(status);
CREATE INDEX IF NOT EXISTS "idx_return_order" ON "ReturnRequest"("orderId");

CREATE TABLE IF NOT EXISTS "Refund" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "orderId" UUID NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
    "returnRequestId" UUID UNIQUE REFERENCES "ReturnRequest"(id),
    amount DECIMAL(12,2) NOT NULL,
    method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    "providerRef" TEXT,
    metadata JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "processedAt" TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS "idx_refund_order" ON "Refund"("orderId");

-- =========================================================
-- PAYMENT META
-- =========================================================

CREATE TABLE IF NOT EXISTS "PaymentMeta" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "orderId" UUID NOT NULL UNIQUE REFERENCES "Order"(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    "transactionId" TEXT,
    status TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    raw JSONB,
    "capturedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_payment_transaction" ON "PaymentMeta"("transactionId");

-- =========================================================
-- ARTICLES
-- =========================================================

CREATE TABLE IF NOT EXISTS "ArticleCategory" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_articlecategory_slug" ON "ArticleCategory"(slug);

CREATE TABLE IF NOT EXISTS "Article" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    thumbnail TEXT,
    status TEXT NOT NULL DEFAULT 'PUBLISHED',
    "publishedAt" TIMESTAMPTZ,
    "categoryId" UUID REFERENCES "ArticleCategory"(id),
    "authorId" UUID REFERENCES "User"(id),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_article_slug" ON "Article"(slug);
CREATE INDEX IF NOT EXISTS "idx_article_status" ON "Article"(status);
CREATE INDEX IF NOT EXISTS "idx_article_category" ON "Article"("categoryId");
CREATE INDEX IF NOT EXISTS "idx_article_published" ON "Article"("publishedAt");