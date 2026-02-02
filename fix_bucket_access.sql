-- This script ensures your bucket is properly configured for public access

-- First, let's verify the bucket exists and check its status
-- Run this in Supabase SQL Editor to see bucket info:
SELECT * FROM storage.buckets WHERE name = 'products';

-- If the bucket is not public, update it:
UPDATE storage.buckets 
SET public = true 
WHERE name = 'products';

-- Also ensure CORS is enabled for the bucket
-- Go to Supabase Dashboard > Storage > products > Configuration
-- Make sure these CORS settings are enabled:
-- Allowed Origins: * (or your specific domain)
-- Allowed Methods: GET, POST, PUT, DELETE
-- Allowed Headers: *

-- If images still don't load, try this policy to allow anonymous access:
CREATE POLICY IF NOT EXISTS "Allow anonymous access"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'products');
