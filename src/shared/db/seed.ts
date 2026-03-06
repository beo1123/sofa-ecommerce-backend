/* eslint-disable @typescript-eslint/no-unused-vars, no-console */
import dotenv from 'dotenv';
dotenv.config();

import { db } from './pg.js';
import { sql } from 'drizzle-orm';
import {
  users,
  roles,
  userRoles,
  categories,
  products,
  productStatuses,
  productVariants,
  productImages,
  inventory,
} from './schema.js';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';

// This script wipes the relevant tables and inserts some starter/mock data.
// Run it with `npm run seed` after you have a running database.

const SEEDED_ACCOUNTS = {
  admin: {
    email: 'admin@admin.com',
    username: 'admin',
    displayName: 'Administrator',
    password: 'Admin@123456',
  },
  user: {
    email: 'user@user.com',
    username: 'user',
    displayName: 'Demo User',
    password: 'User@123456',
  },
} as const;

async function main() {
  console.log('clearing existing data...');
  await db.execute(
    sql`
      TRUNCATE TABLE
        "WishlistItem",
        "Wishlist",
        "Review",
        "ReturnRequest",
        "OrderItem",
        "Order",
        "Address",
        "Coupon",
        "AuditLog",
        "ProductImage",
        "Inventory",
        "ProductVariant",
        "Product",
        "Category",
        "Product_Status",
        "Article",
        "ArticleCategory",
        "UserRole",
        "Role",
        "User"
      RESTART IDENTITY CASCADE
    `,
  );

  console.log('inserting roles and admin user...');
  const adminRoleId = randomUUID();
  const userRoleId = randomUUID();
  await db.insert(roles).values([
    { id: adminRoleId, name: 'admin' },
    { id: userRoleId, name: 'user' },
  ]);

  const adminId = randomUUID();
  const adminPasswordHash = await bcrypt.hash(SEEDED_ACCOUNTS.admin.password, 10);
  await db.insert(users).values({
    id: adminId,
    email: SEEDED_ACCOUNTS.admin.email,
    username: SEEDED_ACCOUNTS.admin.username,
    password: adminPasswordHash,
    displayName: SEEDED_ACCOUNTS.admin.displayName,
  });
  await db.insert(userRoles).values([{ id: randomUUID(), userId: adminId, roleId: adminRoleId }]);

  // create a regular user
  const userId = randomUUID();
  const userPasswordHash = await bcrypt.hash(SEEDED_ACCOUNTS.user.password, 10);
  await db.insert(users).values({
    id: userId,
    email: SEEDED_ACCOUNTS.user.email,
    username: SEEDED_ACCOUNTS.user.username,
    password: userPasswordHash,
    displayName: SEEDED_ACCOUNTS.user.displayName,
  });
  await db.insert(userRoles).values([{ id: randomUUID(), userId, roleId: userRoleId }]);

  console.log('adding sample categories and products...');

  // ensure a few statuses exist so the FK constraint is satisfied
  await db
    .insert(productStatuses)
    .values([
      { name: 'PUBLISHED', description: 'Visible to customers' },
      { name: 'DRAFT', description: 'Hidden from storefront' },
      { name: 'ARCHIVED', description: 'Archived product, not for sale' },
    ])
    .onConflictDoNothing();

  const sofaCat = randomUUID();
  const tableCat = randomUUID();
  const chairCat = randomUUID();
  await db.insert(categories).values([
    {
      id: sofaCat,
      name: 'Sofas',
      slug: 'sofas',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
    },
    {
      id: tableCat,
      name: 'Tables',
      slug: 'tables',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
    },
    {
      id: chairCat,
      name: 'Chairs',
      slug: 'chairs',
      image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
    },
  ]);

  const prod1 = randomUUID();
  // add sample products with variants and inventory
  const sampleProducts = [
    {
      id: prod1,
      title: 'Modern Sofa',
      slug: 'modern-sofa',
      shortDescription: 'Comfortable modern sofa',
      categoryId: sofaCat,
      status: 'PUBLISHED' as const,
      metadata: { category: 'sofas', featured: true },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
          alt: 'Modern sofa in living room',
          isPrimary: true,
        },
      ],
      variants: [
        {
          name: 'Gray',
          skuPrefix: 'GF',
          price: '499.99',
          compareAtPrice: '599.99',
          colorName: 'Gray',
          colorCode: '#808080',
          material: 'Fabric',
          image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
        },
        {
          name: 'Blue',
          skuPrefix: 'BF',
          price: '529.99',
          compareAtPrice: null,
          colorName: 'Blue',
          colorCode: '#0000FF',
          material: 'Fabric',
          image: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9',
        },
      ],
    },
    {
      id: randomUUID(),
      title: 'Wooden Coffee Table',
      slug: 'wooden-coffee-table',
      shortDescription: 'Solid wood coffee table',
      categoryId: tableCat,
      status: 'PUBLISHED' as const,
      metadata: { category: 'tables', featured: false },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
          alt: 'Wooden coffee table',
          isPrimary: true,
        },
      ],
      variants: [
        {
          name: 'Natural',
          skuPrefix: 'WT',
          price: '199.99',
          compareAtPrice: null,
          colorName: 'Natural',
          colorCode: '#C68642',
          material: 'Wood',
          image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
        },
      ],
    },
    {
      id: randomUUID(),
      title: 'Corner Sofa',
      slug: 'corner-sofa',
      shortDescription: 'Large corner sofa',
      categoryId: sofaCat,
      status: 'DRAFT' as const,
      metadata: { category: 'sofas', featured: false },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9',
          alt: 'Corner sofa',
          isPrimary: true,
        },
      ],
      variants: [
        {
          name: 'Beige',
          skuPrefix: 'CF',
          price: '899.99',
          compareAtPrice: '999.99',
          colorName: 'Beige',
          colorCode: '#F5F5DC',
          material: 'Linen',
          image: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9',
        },
      ],
    },
    {
      id: randomUUID(),
      title: 'Dining Chair Premium',
      slug: 'dining-chair-premium',
      shortDescription: 'Ergonomic dining chair',
      categoryId: chairCat,
      status: 'PUBLISHED' as const,
      metadata: { category: 'chairs', featured: true },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
          alt: 'Dining chair premium',
          isPrimary: true,
        },
      ],
      variants: [
        {
          name: 'Black',
          skuPrefix: 'DC',
          price: '149.99',
          compareAtPrice: null,
          colorName: 'Black',
          colorCode: '#000000',
          material: 'Leather',
          image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
        },
      ],
    },
  ];

  for (const sp of sampleProducts) {
    await db.insert(products).values({
      id: sp.id,
      title: sp.title,
      slug: sp.slug,
      shortDescription: sp.shortDescription,
      status: sp.status,
      metadata: sp.metadata,
      categoryId: sp.categoryId,
    });

    for (const img of sp.images) {
      await db.insert(productImages).values({
        id: randomUUID(),
        productId: sp.id,
        url: img.url,
        alt: img.alt,
        isPrimary: img.isPrimary,
      });
    }

    for (let i = 0; i < sp.variants.length; i++) {
      const v = sp.variants[i];
      const varId = randomUUID();
      await db.insert(productVariants).values({
        id: varId,
        productId: sp.id,
        name: v.name,
        skuPrefix: v.skuPrefix,
        price: v.price,
        compareAtPrice: v.compareAtPrice,
        colorName: v.colorName,
        colorCode: v.colorCode,
        material: v.material,
        image: v.image,
      } as never);

      const invId = randomUUID();
      await db.insert(inventory).values({
        id: invId,
        sku: `${v.skuPrefix}-${String(i + 1).padStart(3, '0')}`,
        variantId: varId,
        quantity: Math.floor(Math.random() * 20) + 5,
        reserved: 0,
        location: 'default',
      });
    }
  }

  console.log('seed data inserted.');
  console.log('seeded login accounts:');
  console.log(`- admin: ${SEEDED_ACCOUNTS.admin.email} / ${SEEDED_ACCOUNTS.admin.password}`);
  console.log(`- user : ${SEEDED_ACCOUNTS.user.email} / ${SEEDED_ACCOUNTS.user.password}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
