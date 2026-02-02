-- 1. Create Profiles Table (Users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  role text default 'BILLER',
  avatar text,
  phone text,
  address text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Create Products Table (Menu)
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price numeric not null,
  description text,
  category text,
  image text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Enable Security (RLS)
alter table profiles enable row level security;
alter table products enable row level security;

-- 4. Policies for PROFILES
-- Allow everyone to read profiles (needed for checking roles)
create policy "Public Profiles are viewable by everyone" 
on profiles for select 
using (true);

-- CRITICAL: Allow users to create their own profile during signup
create policy "Users can insert their own profile" 
on profiles for insert 
with check (auth.uid() = id);

-- Allow users to update their own profile
create policy "Users can update own profile" 
on profiles for update 
using (auth.uid() = id);

-- 5. Policies for PRODUCTS
-- Allow everyone to read products (Menu)
create policy "Products are viewable by everyone" 
on products for select 
using (true);

-- Allow Admins to Add/Edit/Delete products
-- (Checks if the user has 'ADMIN' role in their profile)
create policy "Admins can insert products" 
on products for insert 
with check (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'ADMIN'
  )
);

create policy "Admins can update products" 
on products for update 
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'ADMIN'
  )
);

create policy "Admins can delete products" 
on products for delete 
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'ADMIN'
  )
);

-- 6. Grant Access
grant usage on schema public to anon, authenticated;
grant all on profiles to anon, authenticated;
grant all on products to anon, authenticated;
