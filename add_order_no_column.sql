DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sales' AND column_name = 'order_no') THEN
        ALTER TABLE sales ADD COLUMN order_no text;
    END IF;
END $$;
