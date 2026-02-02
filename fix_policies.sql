-- 1. Reset Policies for Profiles
alter table profiles disable row level security;
drop policy if exists "Public Profiles are viewable by everyone" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Users can insert their own profile" on profiles;

-- 2. Re-enable RLS
alter table profiles enable row level security;

-- 3. Create Comprehensive Policies
-- Allow anyone to read profiles (needed for checking roles)
create policy "Public Profiles are viewable by everyone" 
on profiles for select 
using (true);

-- Allow authenticated users to insert THEIR OWN profile
create policy "Users can insert their own profile" 
on profiles for insert 
with check (auth.uid() = id);

-- Allow users to update THEIR OWN profile
create policy "Users can update own profile" 
on profiles for update 
using (auth.uid() = id);

-- 4. Grant access to public (just in case)
grant usage on schema public to anon, authenticated;
grant all on profiles to anon, authenticated;
grant all on products to anon, authenticated;
