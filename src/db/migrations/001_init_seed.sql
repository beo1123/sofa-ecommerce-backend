-- =========================================================
-- SEED DATA (IDEMPOTENT - LOCAL/DEV)
-- =========================================================

DO $$
DECLARE
  v_admin_id UUID;
  v_user_id UUID;

  v_cat_sofa UUID;
  v_cat_table UUID;

  v_product_sofa UUID;
  v_product_table UUID;

  v_variant_sofa_blue UUID;
  v_variant_table_oak UUID;

  v_order_id UUID;
BEGIN
  -- -------------------------------------------------------
  -- ROLES
  -- -------------------------------------------------------
  INSERT INTO "Role"(name)
  VALUES ('ADMIN'), ('USER')
  ON CONFLICT (name) DO NOTHING;

  -- -------------------------------------------------------
  -- USERS
  -- password = "password123" (bcrypt hash)
  -- -------------------------------------------------------
  INSERT INTO "User"(email, username, password, "displayName")
  VALUES
    ('admin@example.com', 'admin', '$2b$10$yZlQ0Zy7FzX8sQp7P4s8Ue8oWmY3ZCjYwYq5jZ8Q8yZcQZl3yGx1G', 'Admin'),
    ('user@example.com', 'user',  '$2b$10$yZlQ0Zy7FzX8sQp7P4s8Ue8oWmY3ZCjYwYq5jZ8Q8yZcQZl3yGx1G', 'Normal User')
  ON CONFLICT (email) DO NOTHING;

  SELECT id INTO v_admin_id FROM "User" WHERE email = 'admin@example.com';
  SELECT id INTO v_user_id  FROM "User" WHERE email = 'user@example.com';

  INSERT INTO "UserRole"("userId", "roleId")
  SELECT v_admin_id, r.id FROM "Role" r WHERE r.name = 'ADMIN'
  ON CONFLICT DO NOTHING;

  INSERT INTO "UserRole"("userId", "roleId")
  SELECT v_user_id, r.id FROM "Role" r WHERE r.name = 'USER'
  ON CONFLICT DO NOTHING;

  -- -------------------------------------------------------
  -- CATEGORIES
  -- -------------------------------------------------------
  INSERT INTO "Category"(name, slug)
  VALUES
    ('Sofa', 'sofa'),
    ('Table', 'table')
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO v_cat_sofa FROM "Category" WHERE slug = 'sofa';
  SELECT id INTO v_cat_table FROM "Category" WHERE slug = 'table';

  -- -------------------------------------------------------
  -- PRODUCTS
  -- -------------------------------------------------------
  INSERT INTO "Product"(title, slug, "shortDescription", status, "categoryId")
  VALUES
    ('Modern Sofa', 'modern-sofa', 'A modern comfortable sofa', 'PUBLISHED', v_cat_sofa),
    ('Oak Coffee Table', 'oak-coffee-table', 'Solid oak table', 'PUBLISHED', v_cat_table)
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO v_product_sofa FROM "Product" WHERE slug = 'modern-sofa';
  SELECT id INTO v_product_table FROM "Product" WHERE slug = 'oak-coffee-table';

  -- -------------------------------------------------------
  -- VARIANTS
  -- -------------------------------------------------------
  INSERT INTO "ProductVariant"(
    "productId", name, "skuPrefix", "colorName", material, price
  )
  VALUES
    (v_product_sofa, 'Blue Fabric', 'SOFA-BLUE', 'Blue', 'Fabric', 1200),
    (v_product_table, 'Oak Wood', 'TABLE-OAK', 'Oak', 'Wood', 450)
  ON CONFLICT DO NOTHING;

  SELECT id INTO v_variant_sofa_blue
  FROM "ProductVariant"
  WHERE "skuPrefix" = 'SOFA-BLUE';

  SELECT id INTO v_variant_table_oak
  FROM "ProductVariant"
  WHERE "skuPrefix" = 'TABLE-OAK';

  -- -------------------------------------------------------
  -- INVENTORY
  -- -------------------------------------------------------
  INSERT INTO "Inventory"(sku, "variantId", quantity)
  VALUES
    ('SOFA-BLUE-001', v_variant_sofa_blue, 20),
    ('TABLE-OAK-001', v_variant_table_oak, 15)
  ON CONFLICT (sku) DO NOTHING;

  -- -------------------------------------------------------
  -- SAMPLE ORDER
  -- -------------------------------------------------------
  INSERT INTO "Order"(
    "orderNumber",
    "userId",
    "recipientName",
    phone,
    email,
    line1,
    city,
    province,
    subtotal,
    shipping,
    tax,
    total,
    "paymentMethod"
  )
  VALUES (
    'ORD-0001',
    v_user_id,
    'Normal User',
    '0123456789',
    'user@example.com',
    '123 Nguyen Trai',
    'TPHCM',
    'HCM',
    1650,
    50,
    0,
    1700,
    'COD'
  )
  ON CONFLICT ("orderNumber") DO NOTHING;

  SELECT id INTO v_order_id FROM "Order" WHERE "orderNumber" = 'ORD-0001';

  INSERT INTO "OrderItem"(
    "orderId",
    "productId",
    "variantId",
    sku,
    name,
    price,
    quantity,
    total
  )
  VALUES (
    v_order_id,
    v_product_sofa,
    v_variant_sofa_blue,
    'SOFA-BLUE-001',
    'Modern Sofa - Blue',
    1200,
    1,
    1200
  )
  ON CONFLICT DO NOTHING;

END $$;
