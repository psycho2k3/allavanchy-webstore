-- Adds Paystack payment tracking to an existing Allavanchy database.
-- Safe to run more than once.

BEGIN;

ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) NOT NULL DEFAULT 'unpaid',
    ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(100),
    ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'orders_payment_status_check'
    ) THEN
        ALTER TABLE orders
            ADD CONSTRAINT orders_payment_status_check
            CHECK (payment_status IN ('unpaid', 'paid', 'failed', 'refunded'));
    END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_payment_reference
    ON orders (payment_reference);

COMMIT;
