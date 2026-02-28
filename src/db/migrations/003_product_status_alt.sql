-- FILE: src/db/migrations/003_product_status_alt.sql
-- MIGRATION: 003_product_status_alt.sql
-- Creates Product_Status table and FK from Product.status -> Product_Status.name

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = 'Product_Status'
  ) THEN
    CREATE TABLE "Product_Status" (
      name TEXT PRIMARY KEY,
      description TEXT,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  END IF;

  INSERT INTO "Product_Status" (name, description) VALUES
    ('PUBLISHED', 'Visible to customers'),
    ('DRAFT', 'Hidden from storefront')
  ON CONFLICT DO NOTHING;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_product_status'
  ) THEN
    ALTER TABLE "Product" ADD CONSTRAINT fk_product_status FOREIGN KEY (status) REFERENCES "Product_Status"(name);
  END IF;
END
$$;
