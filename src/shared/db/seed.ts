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
  productVariants,
  productImages,
  inventory,
} from './schema.js';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';

// This script wipes the relevant tables and inserts some starter/mock data.
// Run it with `npm run seed` after you have a running database.

async function main() {
  console.log('clearing existing data...');
  await db.execute(
    sql`TRUNCATE "UserRole", "Role", "User", "Inventory", "ProductVariant", "ProductImage", "Product", "Category" CASCADE`,
  );

  console.log('inserting roles and admin user...');
  const adminRoleId = randomUUID();
  const userRoleId = randomUUID();
  await db.insert(roles).values([
    { id: adminRoleId, name: 'admin' },
    { id: userRoleId, name: 'user' },
  ]);

  const adminId = randomUUID();
  const passwordHash = await bcrypt.hash('123456', 10);
  await db.insert(users).values({
    id: adminId,
    email: 'admin@sofa.com',
    username: 'admin',
    password: passwordHash,
    displayName: 'Administrator',
  });
  await db.insert(userRoles).values([{ id: randomUUID(), userId: adminId, roleId: adminRoleId }]);

  // create a regular user
  const userId = randomUUID();
  const userPasswordHash = await bcrypt.hash('123456', 10);
  await db.insert(users).values({
    id: userId,
    email: 'user@sofa.com',
    username: 'user',
    password: userPasswordHash,
    displayName: 'Demo User',
  });
  await db.insert(userRoles).values([{ id: randomUUID(), userId, roleId: userRoleId }]);

  console.log('adding sample categories and products...');
  const sofaCat = randomUUID();
  const tableCat = randomUUID();
  await db.insert(categories).values([
    { id: sofaCat, name: 'Sofas', slug: 'sofas', image: null },
    { id: tableCat, name: 'Tables', slug: 'tables', image: null },
  ]);

  const prod1 = randomUUID();
  // add couple more sample products with variants and inventory
  const sampleProducts = [
    {
      id: prod1,
      title: 'Modern Sofa',
      slug: 'modern-sofa',
      shortDescription: 'Comfortable modern sofa',
      categoryId: sofaCat,
      metadata: JSON.stringify({ category: 'sofas' }),
      variants: [
        {
          name: 'Gray',
          skuPrefix: 'GF',
          price: '499.99',
          compareAtPrice: '599.99',
          colorName: 'Gray',
        },
        { name: 'Blue', skuPrefix: 'BF', price: '529.99', compareAtPrice: null, colorName: 'Blue' },
      ],
    },
    {
      id: randomUUID(),
      title: 'Wooden Coffee Table',
      slug: 'wooden-coffee-table',
      shortDescription: 'Solid wood coffee table',
      categoryId: tableCat,
      metadata: JSON.stringify({ category: 'tables' }),
      variants: [
        {
          name: 'Natural',
          skuPrefix: 'WT',
          price: '199.99',
          compareAtPrice: null,
          colorName: 'Natural',
        },
      ],
    },
    {
      id: randomUUID(),
      title: 'Corner Sofa',
      slug: 'corner-sofa',
      shortDescription: 'Large corner sofa',
      categoryId: sofaCat,
      metadata: JSON.stringify({ category: 'sofas' }),
      variants: [
        {
          name: 'Beige',
          skuPrefix: 'CF',
          price: '899.99',
          compareAtPrice: '999.99',
          colorName: 'Beige',
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
      status: 'PUBLISHED',
      metadata: sp.metadata,
      categoryId: sp.categoryId,
    });

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
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
