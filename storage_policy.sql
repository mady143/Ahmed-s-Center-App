-- Enable RLS on objects table (usually enabled by default but good to verify)
-- alter table storage.objects enable row level security;

-- 1. Allow Public Read Access to the 'products' bucket
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'products' );

-- 2. Allow Authenticated Users to Upload to 'products' bucket
-- (You can restrict this to 'ADMIN' role if needed using exists clause like in products table)
create policy "Authenticated Upload"
on storage.objects for insert
with check ( bucket_id = 'products' and auth.role() = 'authenticated' );

-- 3. Allow Users to Update their own uploads (optional, or allow Admins to update any)
create policy "Authenticated Update"
on storage.objects for update
using ( bucket_id = 'products' and auth.role() = 'authenticated' );

-- 4. Allow Users to Delete (optional)
create policy "Authenticated Delete"
on storage.objects for delete
using ( bucket_id = 'products' and auth.role() = 'authenticated' );
