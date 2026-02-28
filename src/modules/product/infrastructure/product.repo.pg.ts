/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq, ne, and, or, inArray, sql, gte, lte, asc, desc } from 'drizzle-orm';
import { db } from '../../../shared/db/pg.js';
import {
  products,
  categories,
  productImages,
  productVariants,
  inventory,
  orderItems,
  reviews,
  productStatuses,
} from '../../../shared/db/schema.js';
import {
  ProductRepository,
  ProductSearchQuery,
  ProductListItem,
} from '../domain/product.repository.js';
import { Category } from '../domain/category.entity.js';
import { Product } from '../domain/product.entity.js';
import { ProductStatus } from '../domain/product-status.entity.js';
import { randomUUID } from 'crypto';

export class PgProductRepository implements ProductRepository {
  // helper used by several operations to make sure a string status exists in
  // the lookup table. callers do not need to worry about duplicates – the
  // insert is done with `ON CONFLICT DO NOTHING`.
  private async ensureStatus(name: string): Promise<void> {
    if (!name) return;
    await db.insert(productStatuses).values({ name }).onConflictDoNothing();
  }

  // ---------- CATEGORY ----------
  async listCategories(): Promise<Category[]> {
    const rows: any[] = await db.select().from(categories);
    return rows.map((r) => new Category(r.id, r.name, r.slug, r.image));
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const row = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    if (!row.length) return null;
    const r = row[0];
    return new Category(r.id, r.name, r.slug, r.image);
  }

  async createCategory(input: { name: string; slug: string; image?: string }): Promise<string> {
    const id = randomUUID();
    await db
      .insert(categories)
      .values({ id, name: input.name, slug: input.slug, image: input.image });
    return id;
  }

  async updateCategory(
    id: string,
    input: { name?: string; slug?: string; image?: string },
  ): Promise<void> {
    const updateData: any = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.slug !== undefined) updateData.slug = input.slug;
    if (input.image !== undefined) updateData.image = input.image;
    if (Object.keys(updateData).length === 0) return;
    await db.update(categories).set(updateData).where(eq(categories.id, id));
  }

  async deleteCategory(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // ---------- PUBLIC PRODUCT ----------
  async searchProducts(
    query: ProductSearchQuery,
  ): Promise<{ items: ProductListItem[]; total: number }> {
    const { q, categorySlug, minPrice, maxPrice, color, material, sort, page, limit } = query;
    const skip = (page - 1) * limit;

    // filter by variant attributes first if needed
    let filteredProductIds: string[] | null = null;
    if (
      minPrice !== undefined ||
      maxPrice !== undefined ||
      color !== undefined ||
      material !== undefined
    ) {
      let variantQuery: any = db
        .select({ productId: productVariants.productId })
        .from(productVariants);
      if (minPrice !== undefined)
        variantQuery = variantQuery.where(gte(productVariants.price, minPrice.toString()));
      if (maxPrice !== undefined)
        variantQuery = variantQuery.where(lte(productVariants.price, maxPrice.toString()));
      if (color !== undefined)
        variantQuery = variantQuery.where(eq(productVariants.colorName, color));
      if (material !== undefined)
        variantQuery = variantQuery.where(eq(productVariants.material, material));

      const rows: any[] = await variantQuery;
      filteredProductIds = Array.from(new Set(rows.map((r) => r.productId)));
      if (filteredProductIds.length === 0) {
        return { items: [], total: 0 };
      }
    }

    const whereClauses: any[] = [eq(products.status, 'PUBLISHED')];
    if (categorySlug) {
      whereClauses.push(eq(categories.slug, categorySlug));
    }
    if (q) {
      const pattern = `%${q.toLowerCase()}%`;
      whereClauses.push(
        or(
          sql`LOWER("Product"."title") LIKE ${pattern}`,
          sql`LOWER("Product"."shortDescription") LIKE ${pattern}`,
          sql`LOWER("Product"."slug") LIKE ${pattern}`,
        ),
      );
    }
    if (filteredProductIds) {
      whereClauses.push(inArray(products.id, filteredProductIds));
    }

    // count distinct products
    const totalRow: any[] = await db
      .select({ total: sql`count(distinct "Product"."id")` })
      .from(products)
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .leftJoin(productVariants, eq(productVariants.productId, products.id))
      .where(and(...whereClauses));
    const total = Number(totalRow[0]?.total ?? 0);

    // build ordering
    // build ordering expression
    let orderExpr: any = desc(products.createdAt);
    if (sort === 'price_asc') {
      orderExpr = asc(productVariants.price);
    } else if (sort === 'price_desc') {
      orderExpr = desc(productVariants.price);
    } else if (sort === 'newest') {
      orderExpr = desc(products.createdAt);
    }

    // fetch products
    let prodQuery: any = db
      .select({
        id: products.id,
        title: products.title,
        slug: products.slug,
        shortDescription: products.shortDescription,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(products)
      .leftJoin(categories, eq(categories.id, products.categoryId));

    if (filteredProductIds) prodQuery = prodQuery.where(inArray(products.id, filteredProductIds));
    if (categorySlug) prodQuery = prodQuery.where(eq(categories.slug, categorySlug));
    if (q) prodQuery = prodQuery.where(whereClauses[whereClauses.length - 1]); // last OR clause
    prodQuery = prodQuery.where(eq(products.status, 'PUBLISHED'));

    prodQuery = prodQuery.orderBy(orderExpr).limit(limit).offset(skip);
    const prodRows: any[] = await prodQuery;

    const ids = prodRows.map((r) => r.id);

    // gather variant details
    const variantRows: any[] = ids.length
      ? await db
          .select({
            id: productVariants.id,
            price: productVariants.price,
            skuPrefix: productVariants.skuPrefix,
            productId: productVariants.productId,
          })
          .from(productVariants)
          .where(inArray(productVariants.productId, ids))
      : [];

    const variantIds = variantRows.map((v) => v.id);
    const inventoryRows: any[] = variantIds.length
      ? await db
          .select({
            variantId: inventory.variantId,
            sku: inventory.sku,
            quantity: inventory.quantity,
            reserved: inventory.reserved,
          })
          .from(inventory)
          .where(inArray(inventory.variantId, variantIds))
      : [];
    const invMap: Record<string, any[]> = {};
    inventoryRows.forEach((i) => {
      if (!invMap[i.variantId]) invMap[i.variantId] = [];
      invMap[i.variantId].push(i);
    });

    const imageRows: any[] = ids.length
      ? await db
          .select({
            productId: productImages.productId,
            url: productImages.url,
            alt: productImages.alt,
          })
          .from(productImages)
          .where(and(eq(productImages.isPrimary, true), inArray(productImages.productId, ids)))
      : [];
    const imageMap = Object.fromEntries(
      imageRows.map((i) => [i.productId, { url: i.url, alt: i.alt }]),
    );

    const items: ProductListItem[] = prodRows.map((p: any) => {
      const variantsForProduct = variantRows.filter((v) => v.productId === p.id);
      const prices = variantsForProduct.map((v) => Number(v.price));
      const priceMin = prices.length ? Math.min(...prices) : null;
      const priceMax = prices.length ? Math.max(...prices) : null;
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        shortDescription: p.shortDescription,
        priceMin,
        priceMax,
        primaryImage: imageMap[p.id] ?? null,
        variantsCount: variantsForProduct.length,
        category: p.categoryName ? { name: p.categoryName, slug: p.categorySlug } : null,
        variants: variantsForProduct.map((v) => ({
          id: v.id,
          skuPrefix: v.skuPrefix,
          inventory: invMap[v.id] || [],
          price: Number(v.price),
        })),
      };
    });

    return { items, total };
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const row: any[] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    if (!row.length) return null;
    const r = row[0];
    // for simplicity return barebone product entity (images & variants will be fetched by use-case if needed)
    return new Product(r.id, r.title, r.slug, r.status, [], []);
  }

  async getProductById(id: string): Promise<Product | null> {
    const row: any[] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (!row.length) return null;
    const r = row[0];
    return new Product(r.id, r.title, r.slug, r.status, [], []);
  }

  // ---------- STORE HELPERS ----------
  async getRelatedProducts(slug: string): Promise<ProductListItem[]> {
    const metaRow: any[] = await db
      .select({ metadata: products.metadata })
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);
    if (!metaRow.length) return [];
    const metadata = metaRow[0].metadata as any;
    const category = metadata?.category ?? null;

    let q: any = db
      .select({
        id: products.id,
        title: products.title,
        slug: products.slug,
        shortDescription: products.shortDescription,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(products)
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .where(and(eq(products.status, 'PUBLISHED'), ne(products.slug, slug)));
    if (category) {
      q = q.where(sql`metadata->>'category' = ${category}`);
    }
    q = q.orderBy(desc(products.createdAt)).limit(4);

    const rows: any[] = await q;
    const ids = rows.map((r) => r.id);
    const variantRows: any[] = ids.length
      ? await db
          .select({
            id: productVariants.id,
            price: productVariants.price,
            skuPrefix: productVariants.skuPrefix,
            productId: productVariants.productId,
          })
          .from(productVariants)
          .where(inArray(productVariants.productId, ids))
      : [];

    const variantIds = variantRows.map((v) => v.id);
    const inventoryRows: any[] = variantIds.length
      ? await db
          .select({
            variantId: inventory.variantId,
            sku: inventory.sku,
            quantity: inventory.quantity,
            reserved: inventory.reserved,
          })
          .from(inventory)
          .where(inArray(inventory.variantId, variantIds))
      : [];
    const invMap: Record<string, any[]> = {};
    inventoryRows.forEach((i) => {
      if (!invMap[i.variantId]) invMap[i.variantId] = [];
      invMap[i.variantId].push(i);
    });

    const imageRows: any[] = ids.length
      ? await db
          .select({
            productId: productImages.productId,
            url: productImages.url,
            alt: productImages.alt,
          })
          .from(productImages)
          .where(and(eq(productImages.isPrimary, true), inArray(productImages.productId, ids)))
      : [];
    const imageMap = Object.fromEntries(
      imageRows.map((i) => [i.productId, { url: i.url, alt: i.alt }]),
    );

    return rows.map((p: any) => {
      const variantsForProduct = variantRows.filter((v) => v.productId === p.id);
      const prices = variantsForProduct.map((v) => Number(v.price));
      const priceMin = prices.length ? Math.min(...prices) : null;
      const priceMax = prices.length ? Math.max(...prices) : null;
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        shortDescription: p.shortDescription,
        priceMin,
        priceMax,
        primaryImage: imageMap[p.id] ?? null,
        variantsCount: variantsForProduct.length,
        category: p.categoryName ? { name: p.categoryName, slug: p.categorySlug } : null,
        variants: variantsForProduct.map((v) => ({
          id: v.id,
          skuPrefix: v.skuPrefix,
          inventory: invMap[v.id] || [],
          price: Number(v.price),
        })),
      };
    });
  }

  async getBestSellingProducts(limit: number): Promise<ProductListItem[]> {
    const top = await db
      .select({ productId: orderItems.productId, sumQty: sql`sum("quantity")` })
      .from(orderItems)
      .where(sql`"Order"."status" IN ('PAID','FULFILLED','COD_COMPLETED')`)
      .groupBy(orderItems.productId)
      .orderBy(desc(sql`sum("quantity")`))
      .limit(limit);
    const ids = top.map((t: any) => t.productId).filter(Boolean);

    let rows: any[] = [];
    if (ids.length) {
      rows = await db
        .select({
          id: products.id,
          title: products.title,
          slug: products.slug,
          shortDescription: products.shortDescription,
          categoryName: categories.name,
          categorySlug: categories.slug,
        })
        .from(products)
        .leftJoin(categories, eq(categories.id, products.categoryId))
        .where(inArray(products.id, ids))
        .limit(limit);
    }
    if (rows.length < limit) {
      const fallback = await db
        .select({
          id: products.id,
          title: products.title,
          slug: products.slug,
          shortDescription: products.shortDescription,
          categoryName: categories.name,
          categorySlug: categories.slug,
        })
        .from(products)
        .leftJoin(categories, eq(categories.id, products.categoryId))
        .where(and(eq(products.status, 'PUBLISHED'), sql`id NOT IN (${sql`${ids}`})`))
        .orderBy(desc(products.createdAt))
        .limit(limit - rows.length);
      rows = rows.concat(fallback);
    }
    const prodIds = rows.map((r) => r.id);
    const variantRows: any[] = prodIds.length
      ? await db
          .select({ price: productVariants.price, productId: productVariants.productId })
          .from(productVariants)
          .where(inArray(productVariants.productId, prodIds))
      : [];
    const imageRows: any[] = prodIds.length
      ? await db
          .select({ productId: productImages.productId, url: productImages.url })
          .from(productImages)
          .where(and(eq(productImages.isPrimary, true), inArray(productImages.productId, prodIds)))
      : [];
    const imageMap = Object.fromEntries(imageRows.map((i) => [i.productId, i.url]));

    // build full items similar to search function
    const invIds = variantRows.map((v) => v.id);
    const inventoryRowsDetail: any[] = invIds.length
      ? await db
          .select({
            variantId: inventory.variantId,
            sku: inventory.sku,
            quantity: inventory.quantity,
            reserved: inventory.reserved,
          })
          .from(inventory)
          .where(inArray(inventory.variantId, invIds))
      : [];
    const invMapDetail: Record<string, any[]> = {};
    inventoryRowsDetail.forEach((i) => {
      if (!invMapDetail[i.variantId]) invMapDetail[i.variantId] = [];
      invMapDetail[i.variantId].push(i);
    });

    return rows.map((p: any) => {
      const variantsForProduct = variantRows.filter((v) => v.productId === p.id);
      const prices = variantsForProduct.map((v) => Number(v.price));
      const priceMin = prices.length ? Math.min(...prices) : null;
      const priceMax = prices.length ? Math.max(...prices) : null;
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        shortDescription: p.shortDescription,
        priceMin,
        priceMax,
        primaryImage: imageMap[p.id] ?? null,
        variantsCount: variantsForProduct.length,
        category: p.categoryName ? { name: p.categoryName, slug: p.categorySlug } : null,
        variants: variantsForProduct.map((v) => ({
          id: v.id,
          skuPrefix: v.skuPrefix,
          inventory: invMapDetail[v.id] || [],
          price: Number(v.price),
        })),
      };
    });
  }

  async getFeaturedProducts(limit: number): Promise<ProductListItem[]> {
    const reviewAgg: any[] = await db
      .select({
        productId: reviews.productId,
        avgRating: sql`avg("rating")`,
        countRating: sql`count("rating")`,
      })
      .from(reviews)
      .where(eq(reviews.approved, true))
      .groupBy(reviews.productId);
    const ratingMap: Record<string, { avg: number; count: number }> = {};
    reviewAgg.forEach((r) => {
      ratingMap[r.productId] = { avg: Number(r.avgRating) || 0, count: Number(r.countRating) || 0 };
    });

    const soldAgg: any[] = await db
      .select({ productId: orderItems.productId, sumQty: sql`sum("quantity")` })
      .from(orderItems)
      .where(sql`"Order"."status" IN ('PAID','FULFILLED','COD_COMPLETED')`)
      .groupBy(orderItems.productId);
    const soldMap: Record<string, number> = {};
    soldAgg.forEach((s) => {
      if (s.productId) soldMap[s.productId] = Number(s.sumQty) || 0;
    });

    const rows: any[] = await db
      .select({
        id: products.id,
        title: products.title,
        slug: products.slug,
        shortDescription: products.shortDescription,
        categoryName: categories.name,
        categorySlug: categories.slug,
        createdAt: products.createdAt,
      })
      .from(products)
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .where(eq(products.status, 'PUBLISHED'));

    const scored = rows.map((p) => {
      const r = ratingMap[p.id] ?? { avg: 0, count: 0 };
      const sold = soldMap[p.id] ?? 0;
      const score = (r.avg || 0) * 2 + Math.log((r.count || 0) + 1) + Math.log(sold + 1);
      return { ...p, score };
    });
    scored.sort((a, b) => b.score - a.score);
    const selected = scored.slice(0, limit);

    const ids = selected.map((p) => p.id);
    const variantRows: any[] = ids.length
      ? await db
          .select({
            id: productVariants.id,
            price: productVariants.price,
            skuPrefix: productVariants.skuPrefix,
            productId: productVariants.productId,
          })
          .from(productVariants)
          .where(inArray(productVariants.productId, ids))
      : [];
    const variantIds = variantRows.map((v) => v.id);
    const inventoryRowsDetail: any[] = variantIds.length
      ? await db
          .select({
            variantId: inventory.variantId,
            sku: inventory.sku,
            quantity: inventory.quantity,
            reserved: inventory.reserved,
          })
          .from(inventory)
          .where(inArray(inventory.variantId, variantIds))
      : [];
    const invMapDetail: Record<string, any[]> = {};
    inventoryRowsDetail.forEach((i) => {
      if (!invMapDetail[i.variantId]) invMapDetail[i.variantId] = [];
      invMapDetail[i.variantId].push(i);
    });

    const imageRows: any[] = ids.length
      ? await db
          .select({
            productId: productImages.productId,
            url: productImages.url,
            alt: productImages.alt,
          })
          .from(productImages)
          .where(and(eq(productImages.isPrimary, true), inArray(productImages.productId, ids)))
      : [];
    const imageMap = Object.fromEntries(
      imageRows.map((i) => [i.productId, { url: i.url, alt: i.alt }]),
    );

    return selected.map((p: any) => {
      const variantsForProduct = variantRows.filter((v) => v.productId === p.id);
      const prices = variantsForProduct.map((v) => Number(v.price));
      const priceMin = prices.length ? Math.min(...prices) : null;
      const priceMax = prices.length ? Math.max(...prices) : null;
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        shortDescription: p.shortDescription,
        priceMin,
        priceMax,
        primaryImage: imageMap[p.id] ?? null,
        variantsCount: variantsForProduct.length,
        category: p.categoryName ? { name: p.categoryName, slug: p.categorySlug } : null,
        variants: variantsForProduct.map((v) => ({
          id: v.id,
          skuPrefix: v.skuPrefix,
          inventory: invMapDetail[v.id] || [],
          price: Number(v.price),
        })),
      };
    });
  }

  async getFilters(): Promise<{
    materials: string[];
    colors: string[];
    priceMin: number;
    priceMax: number;
  }> {
    const variants: any[] = await db
      .select({
        material: productVariants.material,
        color: productVariants.colorName,
        price: productVariants.price,
      })
      .from(productVariants)
      .leftJoin(products, eq(products.id, productVariants.productId))
      .where(eq(products.status, 'PUBLISHED'));

    if (!variants.length) {
      return { materials: [], colors: [], priceMin: 0, priceMax: 0 };
    }

    const materialSet = new Set<string>();
    const colorSet = new Set<string>();
    let minPrice = Number.MAX_SAFE_INTEGER;
    let maxPrice = 0;

    for (const v of variants) {
      if (v.material) materialSet.add(String(v.material).trim());
      if (v.color) colorSet.add(String(v.color).trim());
      const price = Number(v.price);
      if (!isNaN(price)) {
        if (price < minPrice) minPrice = price;
        if (price > maxPrice) maxPrice = price;
      }
    }
    if (minPrice === Number.MAX_SAFE_INTEGER) minPrice = 0;

    return {
      materials: Array.from(materialSet),
      colors: Array.from(colorSet),
      priceMin: minPrice,
      priceMax: maxPrice,
    };
  }

  // ---------- ADMIN CRUD ----------
  async createProduct(input: {
    title: string;
    slug: string;
    shortDescription?: string;
    description?: string;
    categoryId?: string;
    status?: string;
  }): Promise<string> {
    const statusValue = input.status || 'PUBLISHED';
    await this.ensureStatus(statusValue);

    const id = randomUUID();
    await db.insert(products).values({
      id,
      title: input.title,
      slug: input.slug,
      shortDescription: input.shortDescription,
      description: input.description,
      categoryId: input.categoryId,
      status: statusValue,
    });
    return id;
  }

  async updateProduct(
    id: string,
    input: {
      title?: string;
      slug?: string;
      shortDescription?: string;
      description?: string;
      categoryId?: string;
      status?: string;
    },
  ): Promise<void> {
    const updateData: any = {};
    if (input.title !== undefined) updateData.title = input.title;
    if (input.slug !== undefined) updateData.slug = input.slug;
    if (input.shortDescription !== undefined) updateData.shortDescription = input.shortDescription;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.categoryId !== undefined) updateData.categoryId = input.categoryId;
    if (input.status !== undefined) {
      updateData.status = input.status;
      await this.ensureStatus(input.status);
    }
    if (Object.keys(updateData).length === 0) return;
    await db.update(products).set(updateData).where(eq(products.id, id));
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // ───── Status lookup ─────
  async listStatuses(): Promise<ProductStatus[]> {
    const rows: any[] = await db.select().from(productStatuses);
    return rows.map((r) => new ProductStatus(r.name, r.description));
  }

  async createStatus(name: string, description?: string): Promise<void> {
    if (!name) return;
    await db.insert(productStatuses).values({ name, description }).onConflictDoNothing();
  }

  // ---------- IMAGES ----------
  async addProductImage(
    productId: string,
    input: { url: string; alt?: string; isPrimary?: boolean },
  ): Promise<string> {
    const id = randomUUID();
    await db.insert(productImages).values({
      id,
      productId,
      url: input.url,
      alt: input.alt || null,
      isPrimary: input.isPrimary ?? false,
    });
    return id;
  }

  async removeProductImage(imageId: string): Promise<void> {
    await db.delete(productImages).where(eq(productImages.id, imageId));
  }

  async setPrimaryImage(productId: string, imageId: string): Promise<void> {
    // clear previous
    await db
      .update(productImages)
      .set({ isPrimary: false })
      .where(eq(productImages.productId, productId));
    await db.update(productImages).set({ isPrimary: true }).where(eq(productImages.id, imageId));
  }

  // ---------- VARIANTS & INVENTORY ----------
  async addVariant(
    productId: string,
    input: {
      name: string;
      skuPrefix?: string;
      colorCode?: string;
      colorName?: string;
      material?: string;
      price: number;
      compareAtPrice?: number;
      image?: string;
    },
  ): Promise<string> {
    const id = randomUUID();
    // We generate the id ourselves and need to pass it explicitly even though
    // the table has a default value. Drizzle's inferred insert type omits the
    // primary key, so cast to any here to satisfy the compiler.
    await db.insert(productVariants).values({
      id,
      productId,
      name: input.name,
      skuPrefix: input.skuPrefix,
      colorCode: input.colorCode,
      colorName: input.colorName,
      material: input.material,
      price: input.price,
      compareAtPrice: input.compareAtPrice,
      image: input.image,
    } as any);
    return id;
  }

  async updateVariant(
    id: string,
    input: {
      name?: string;
      price?: number;
      compareAtPrice?: number;
      image?: string;
      colorCode?: string;
      colorName?: string;
      material?: string;
    },
  ): Promise<void> {
    const updateData: any = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.price !== undefined) updateData.price = input.price;
    if (input.compareAtPrice !== undefined) updateData.compareAtPrice = input.compareAtPrice;
    if (input.image !== undefined) updateData.image = input.image;
    if (input.colorCode !== undefined) updateData.colorCode = input.colorCode;
    if (input.colorName !== undefined) updateData.colorName = input.colorName;
    if (input.material !== undefined) updateData.material = input.material;
    if (Object.keys(updateData).length === 0) return;
    await db.update(productVariants).set(updateData).where(eq(productVariants.id, id));
  }

  async updateInventory(
    variantId: string,
    input: { quantity: number; reserved?: number },
  ): Promise<void> {
    const updateData: any = { quantity: input.quantity };
    if (input.reserved !== undefined) updateData.reserved = input.reserved;
    await db.update(inventory).set(updateData).where(eq(inventory.variantId, variantId));
  }
}
