-- Brings an existing Allavanchy database up to date with the current schema:
-- product columns, user status, order item sizes, product deletes that keep
-- order history, and the site settings row.
-- Safe to run more than once.

BEGIN;

-- Products ---------------------------------------------------------------

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS image_url TEXT,
    ADD COLUMN IF NOT EXISTS image_urls TEXT[] NOT NULL DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS category VARCHAR(100) NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS sizes TEXT[] NOT NULL DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

UPDATE products
SET image_urls = ARRAY[image_url]
WHERE image_url IS NOT NULL
    AND image_url <> ''
    AND COALESCE(cardinality(image_urls), 0) = 0;

-- Users ------------------------------------------------------------------

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'active';

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'users_status_check'
    ) THEN
        ALTER TABLE users
            ADD CONSTRAINT users_status_check
            CHECK (status IN ('active', 'suspended'));
    END IF;
END $$;

-- Order items ------------------------------------------------------------

ALTER TABLE order_items
    ADD COLUMN IF NOT EXISTS size TEXT;

-- Deleting a product must not be blocked by past orders. The item keeps its
-- product_name and price snapshot; product_id becomes NULL.
ALTER TABLE order_items
    ALTER COLUMN product_id DROP NOT NULL;

DO $$
DECLARE
    fk RECORD;
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'order_items'::regclass
            AND confrelid = 'products'::regclass
            AND contype = 'f'
            AND confdeltype = 'n'
    ) THEN
        FOR fk IN
            SELECT conname
            FROM pg_constraint
            WHERE conrelid = 'order_items'::regclass
                AND confrelid = 'products'::regclass
                AND contype = 'f'
        LOOP
            EXECUTE format('ALTER TABLE order_items DROP CONSTRAINT %I', fk.conname);
        END LOOP;

        ALTER TABLE order_items
            ADD CONSTRAINT order_items_product_id_fkey
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Site settings ----------------------------------------------------------

INSERT INTO site_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

COMMIT;
