-- Create connected_accounts table to store OAuth provider tokens
create table if not exists connected_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  provider text not null, -- 'google', 'facebook', etc.
  provider_account_id text,
  access_token text,
  refresh_token text,
  expires_at timestamptz,
  id_token text,
  scope text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- Prevent duplicate accounts for same provider per user
  unique(user_id, provider)
);

-- RLS Policies
alter table connected_accounts enable row level security;

-- Users can view their own connected accounts
create policy "Users can view own connected accounts"
  on connected_accounts for select
  using ( auth.uid() = user_id );

-- Users can delete their own connected accounts
create policy "Users can delete own connected accounts"
  on connected_accounts for delete
  using ( auth.uid() = user_id );

-- Service role only for insert/update (handled by server-side code)
-- But if we want to allow potential client-side linking later, we might adjust.
-- For now, we'll keep insert/update restrictive or allow self if needed.
-- Let's allow users to insert if it matches their ID (though usually this happens via callback)
create policy "Users can insert own connected accounts"
  on connected_accounts for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own connected accounts"
  on connected_accounts for update
  using ( auth.uid() = user_id );
