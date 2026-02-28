-- FILE: src/db/migrations/002_product_status.sql
-- MIGRATION: 002_product_status.sql
-- Adds ProductStatus lookup table and FK from Product.status

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = 'ProductStatus'
  ) THEN
    CREATE TABLE "ProductStatus" (
      name TEXT PRIMARY KEY,
      description TEXT,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  END IF;

  INSERT INTO "ProductStatus" (name, description) VALUES
    ('PUBLISHED', 'Visible to customers'),
    ('DRAFT', 'Hidden from storefront')
  ON CONFLICT DO NOTHING;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_product_status'
  ) THEN
    ALTER TABLE "Product" ADD CONSTRAINT fk_product_status FOREIGN KEY (status) REFERENCES "ProductStatus"(name);
  END IF;
END
$$;
