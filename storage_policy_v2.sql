-- SIMPLE STORAGE POLICIES FOR PRODUCTS BUCKET
-- Run this in Supabase SQL Editor

-- First, drop any existing policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous access" ON storage.objects;

-- Create simple policies that work
-- 1. Allow ANYONE to read from products bucket
CREATE POLICY "Anyone can view products"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- 2. Allow AUTHENTICATED users to insert
CREATE POLICY "Authenticated users can upload products"  
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products');

-- 3. Allow AUTHENTICATED users to update
CREATE POLICY "Authenticated users can update products"
ON storage.objects FOR UPDATE  
TO authenticated
USING (bucket_id = 'products');

-- 4. Allow AUTHENTICATED users to delete
CREATE POLICY "Authenticated users can delete products"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'products');
