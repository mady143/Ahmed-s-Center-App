-- Helper block to safely add columns if they are missing
DO $$
BEGIN
    -- 1. Check and add payment_method
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sales' AND column_name = 'payment_method') THEN
        ALTER TABLE sales ADD COLUMN payment_method text;
    END IF;

    -- 2. Check and add total
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sales' AND column_name = 'total') THEN
        ALTER TABLE sales ADD COLUMN total numeric;
    END IF;

    -- 3. Check and add items (ensure it is logic valid, if it was text, we might leave it)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sales' AND column_name = 'items') THEN
        ALTER TABLE sales ADD COLUMN items jsonb;
    END IF;
END $$;

-- 4. Ensure RLS is ON
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- 5. Force Grant Permissions (Again)
GRANT ALL ON sales TO anon;
GRANT ALL ON sales TO authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 6. Re-apply the Insert Policy explicitly
DROP POLICY IF EXISTS "Enable insert for everyone" ON sales;
CREATE POLICY "Enable insert for everyone" 
ON sales FOR INSERT 
WITH CHECK (true);
