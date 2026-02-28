import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  unique,
  integer,
  decimal,
  boolean,
  jsonb,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// =========================================================
// USERS & AUTH
// =========================================================

export const users = pgTable(
  'User',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    username: text('username').unique(),
    password: text('password'),
    displayName: text('displayName'),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
    lastLogin: timestamp('lastLogin', { withTimezone: true }),
  },
  (table) => ({
    idx_user_email: index('idx_user_email').on(table.email),
  }),
);

export const roles = pgTable('Role', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
});

export const userRoles = pgTable(
  'UserRole',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    roleId: uuid('roleId')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    uq_user_role: unique('uq_user_role').on(table.userId, table.roleId),
    idx_userrole_role: index('idx_userrole_role').on(table.roleId),
  }),
);

// =========================================================
// CATEGORIES & PRODUCTS
// =========================================================

// small lookup table so we can manage product statuses from the database
export const productStatuses = pgTable('Product_Status', {
  // name is used as the natural key so we can continue treating status as a
  // string in most of the code. this makes it easy to add new statuses later
  // without touching the application logic; just insert a row in this table.
  name: text('name').primaryKey(),
  description: text('description'),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
});

export const categories = pgTable(
  'Category',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull().unique(),
    slug: text('slug').notNull().unique(),
    image: text('image'),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    idx_category_name: index('idx_category_name').on(table.name),
  }),
);

export const products = pgTable(
  'Product',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    shortDescription: text('shortDescription'),
    description: text('description'),
    status: text('status')
      .notNull()
      .default('PUBLISHED')
      .references(() => productStatuses.name),
    metadata: jsonb('metadata'),
    categoryId: uuid('categoryId').references(() => categories.id),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    idx_product_slug: index('idx_product_slug').on(table.slug),
    idx_product_status: index('idx_product_status').on(table.status),
    idx_product_createdAt: index('idx_product_createdAt').on(table.createdAt),
    idx_product_category: index('idx_product_category').on(table.categoryId),

    // SỬA TẠI ĐÂY: Chỉ truyền cột createdAt, Postgres sẽ tự tối ưu cho cả ASC và DESC
    idx_product_published: index('idx_product_published')
      .on(table.createdAt)
      .where(sql`status = 'PUBLISHED'`),
  }),
);

export const productImages = pgTable(
  'ProductImage',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    url: text('url').notNull(),
    alt: text('alt'),
    isPrimary: boolean('isPrimary').notNull().default(false),
    productId: uuid('productId')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    idx_productimage_product: index('idx_productimage_product').on(table.productId),
  }),
);

export const productVariants = pgTable(
  'ProductVariant',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('productId')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    skuPrefix: text('skuPrefix'),
    colorCode: text('colorCode'),
    colorName: text('colorName'),
    material: text('material'),
    price: decimal('price', { precision: 12, scale: 2 }).notNull(),
    compareAtPrice: decimal('compareAtPrice', { precision: 12, scale: 2 }),
    image: text('image'),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    idx_variant_product: index('idx_variant_product').on(table.productId),
    idx_variant_name: index('idx_variant_name').on(table.name),
    idx_variant_color: index('idx_variant_color').on(table.colorName),
    idx_variant_material: index('idx_variant_material').on(table.material),
  }),
);

export const inventory = pgTable(
  'Inventory',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sku: text('sku').notNull().unique(),
    variantId: uuid('variantId')
      .notNull()
      .references(() => productVariants.id, { onDelete: 'cascade' }),
    quantity: integer('quantity').notNull().default(0),
    reserved: integer('reserved').notNull().default(0),
    location: text('location'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    idx_inventory_sku: index('idx_inventory_sku').on(table.sku),
    idx_inventory_variant: index('idx_inventory_variant').on(table.variantId),
  }),
);

// =========================================================
// ADDRESS & ORDERS
// =========================================================

export const addresses = pgTable(
  'Address',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('userId').references(() => users.id),
    fullName: text('fullName').notNull(),
    line1: text('line1').notNull(),
    line2: text('line2'),
    city: text('city').notNull(),
    province: text('province'),
    postalCode: text('postalCode'),
    country: text('country').notNull(),
    phone: text('phone'),
    metadata: jsonb('metadata'),
    isDefaultShipping: boolean('isDefaultShipping').notNull().default(false),
    isDefaultBilling: boolean('isDefaultBilling').notNull().default(false),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    idx_address_user: index('idx_address_user').on(table.userId),
  }),
);

export const orders = pgTable(
  'Order',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orderNumber: text('orderNumber').notNull().unique(),
    userId: uuid('userId').references(() => users.id),
    shippingAddressId: uuid('shippingAddressId').references(() => addresses.id),
    billingAddressId: uuid('billingAddressId').references(() => addresses.id),
    recipientName: text('recipientName').notNull(),
    phone: text('phone').notNull(),
    email: text('email'),
    line1: text('line1').notNull(),
    city: text('city').notNull().default('TPHCM'),
    province: text('province').notNull(),
    country: text('country').notNull().default('Việt Nam'),
    status: text('status').notNull().default('CREATED'),
    subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull(),
    shipping: decimal('shipping', { precision: 12, scale: 2 }).notNull().default('0'),
    tax: decimal('tax', { precision: 12, scale: 2 }).notNull().default('0'),
    total: decimal('total', { precision: 12, scale: 2 }).notNull(),
    paymentMethod: text('paymentMethod').notNull(),
    couponId: uuid('couponId'),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    idx_order_user: index('idx_order_user').on(table.userId),
    idx_order_status: index('idx_order_status').on(table.status),
    idx_order_created: index('idx_order_created').on(table.createdAt),
  }),
);

export const orderItems = pgTable(
  'OrderItem',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('orderId')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    productId: uuid('productId').references(() => products.id),
    variantId: uuid('variantId').references(() => productVariants.id),
    sku: text('sku'),
    name: text('name').notNull(),
    price: decimal('price', { precision: 12, scale: 2 }).notNull(),
    quantity: integer('quantity').notNull(),
    total: decimal('total', { precision: 12, scale: 2 }).notNull(),
    returned: boolean('returned').notNull().default(false),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    idx_orderitem_order: index('idx_orderitem_order').on(table.orderId),
    idx_orderitem_product: index('idx_orderitem_product').on(table.productId),
  }),
);

// =========================================================
// COUPONS, REVIEWS, WISHLIST
// =========================================================

export const coupons = pgTable(
  'Coupon',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    code: text('code').notNull().unique(),
    type: text('type').notNull(),
    amount: decimal('amount', { precision: 12, scale: 2 }),
    percent: integer('percent'),
    description: text('description'),
    startsAt: timestamp('startsAt', { withTimezone: true }),
    expiresAt: timestamp('expiresAt', { withTimezone: true }),
    usageLimit: integer('usageLimit'),
    usagePerUser: integer('usagePerUser'),
    timesUsed: integer('timesUsed').notNull().default(0),
    active: boolean('active').notNull().default(true),
    metadata: jsonb('metadata'),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    idx_coupon_code: index('idx_coupon_code').on(table.code),
  }),
);

export const reviews = pgTable(
  'Review',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('userId').references(() => users.id),
    productId: uuid('productId')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(),
    title: text('title'),
    body: text('body'),
    approved: boolean('approved').notNull().default(false),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    uq_review_user_product: unique('uq_review_user_product').on(table.userId, table.productId),
    idx_review_product: index('idx_review_product').on(table.productId),
    idx_review_user: index('idx_review_user').on(table.userId),
  }),
);

export const wishlists = pgTable('Wishlist', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('userId')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
});

export const wishlistItems = pgTable(
  'WishlistItem',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    wishlistId: uuid('wishlistId')
      .notNull()
      .references(() => wishlists.id, { onDelete: 'cascade' }),
    productId: uuid('productId')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    variantId: uuid('variantId'),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    uq_wishlist_item: unique('uq_wishlist_item').on(
      table.wishlistId,
      table.productId,
      table.variantId,
    ),
    idx_wishlist_product: index('idx_wishlist_product').on(table.productId),
  }),
);

// =========================================================
// AUDIT LOG
// =========================================================

export const auditLogs = pgTable(
  'AuditLog',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    actorId: uuid('actorId').references(() => users.id),
    action: text('action').notNull(),
    entity: text('entity').notNull(),
    entityId: text('entityId'),
    changes: jsonb('changes'),
    ip: text('ip'),
    userAgent: text('userAgent'),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    idx_audit_actor: index('idx_audit_actor').on(table.actorId),
    idx_audit_entity: index('idx_audit_entity').on(table.entity, table.entityId),
  }),
);

// =========================================================
// RETURNS & REFUNDS
// =========================================================

export const returnRequests = pgTable(
  'ReturnRequest',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('orderId')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    orderItemId: uuid('orderItemId')
      .notNull()
      .references(() => orderItems.id, { onDelete: 'cascade' }),
    reason: text('reason').notNull(),
    status: text('status').notNull().default('PENDING'),
    evidence: jsonb('evidence'),
    requestedAt: timestamp('requestedAt', { withTimezone: true }).defaultNow().notNull(),
    processedAt: timestamp('processedAt', { withTimezone: true }),
    metadata: jsonb('metadata'),
  },
  (table) => ({
    idx_return_status: index('idx_return_status').on(table.status),
    idx_return_order: index('idx_return_order').on(table.orderId),
  }),
);

// =========================================================
// ARTICLES
// =========================================================

export const articleCategories = pgTable(
  'ArticleCategory',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    idx_articlecategory_slug: index('idx_articlecategory_slug').on(table.slug),
  }),
);

export const articles = pgTable(
  'Article',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    excerpt: text('excerpt'),
    content: text('content').notNull(),
    thumbnail: text('thumbnail'),
    status: text('status').notNull().default('PUBLISHED'),
    publishedAt: timestamp('publishedAt', { withTimezone: true }),
    categoryId: uuid('categoryId').references(() => articleCategories.id),
    authorId: uuid('authorId').references(() => users.id),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    idx_article_slug: index('idx_article_slug').on(table.slug),
    idx_article_status: index('idx_article_status').on(table.status),
    idx_article_category: index('idx_article_category').on(table.categoryId),
    idx_article_published: index('idx_article_published').on(table.publishedAt),
  }),
);
