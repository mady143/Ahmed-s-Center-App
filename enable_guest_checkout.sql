-- 1. Create Sales Table if it doesn't exist
create table if not exists sales (
  id uuid default gen_random_uuid() primary key,
  timestamp timestamp with time zone default timezone('utc'::text, now()),
  items jsonb,
  total numeric,
  payment_method text
);

-- 2. Enable Row Level Security (RLS)
alter table sales enable row level security;

-- DROP existing policies to avoid conflicts
drop policy if exists "Enable insert for everyone" on sales;
drop policy if exists "Enable select for authenticated users" on sales;
drop policy if exists "Enable update for authenticated users" on sales;
drop policy if exists "Enable delete for authenticated users" on sales;

-- 3. Create Policies

-- Policy: Allow EVERYONE (Guest + Admin) to create a new sale
-- This is critical for guest checkout to work
create policy "Enable insert for everyone" 
on sales for insert 
with check (true);

-- Policy: Allow ONLY Authenticated users (Admins) to view sales
-- This prevents guests from seeing other people's data
create policy "Enable select for authenticated users" 
on sales for select 
using (auth.role() = 'authenticated');

-- Policy: Allow ONLY Authenticated users (Admins) to update sales
-- This allows admins to edit invoices
create policy "Enable update for authenticated users" 
on sales for update 
using (auth.role() = 'authenticated');

-- Policy: Allow ONLY Authenticated users (Admins) to delete sales
create policy "Enable delete for authenticated users" 
on sales for delete 
using (auth.role() = 'authenticated');

-- 4. Grant Permissions
grant all on sales to anon;
grant all on sales to authenticated;
grant usage on schema public to anon, authenticated;
