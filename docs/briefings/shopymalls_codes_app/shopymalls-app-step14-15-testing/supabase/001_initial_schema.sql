
-- Shopymalls MVP Supabase schema
-- Step 14.11
-- Run this migration in the Supabase SQL Editor.

create extension if not exists "pgcrypto";

create type public.user_role as enum ('shopper', 'retailer', 'mall_admin', 'shopymalls_admin');
create type public.account_status as enum ('active', 'pending', 'blocked');
create type public.deal_status as enum ('draft', 'pending', 'active', 'expired', 'rejected');
create type public.campaign_status as enum ('draft', 'pending', 'active', 'paused', 'completed');
create type public.subscription_plan as enum ('free', 'pro', 'premium', 'mall');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role public.user_role not null default 'shopper',
  status public.account_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.malls (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  city text,
  country text default 'Indonesia',
  address text,
  description text,
  cover_image_url text,
  logo_url text,
  opening_hours jsonb default '{}'::jsonb,
  website_url text,
  instagram_url text,
  tiktok_url text,
  facebook_url text,
  facilities jsonb default '[]'::jsonb,
  status public.account_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  mall_id uuid not null references public.malls(id) on delete cascade,
  name text not null,
  slug text not null,
  brand_name text,
  description text,
  logo_url text,
  cover_image_url text,
  level text,
  store_number text,
  phone text,
  website_url text,
  instagram_url text,
  tiktok_url text,
  facebook_url text,
  opening_hours jsonb default '{}'::jsonb,
  rating numeric(2,1),
  status public.account_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(mall_id, slug)
);

create table if not exists public.store_staff (
  store_id uuid not null references public.stores(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  is_owner boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (store_id, user_id)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null,
  description text,
  image_url text,
  price numeric(12,2),
  sale_price numeric(12,2),
  status public.account_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  mall_id uuid not null references public.malls(id) on delete cascade,
  title text not null,
  description text,
  image_url text,
  discount_label text,
  terms text,
  start_at timestamptz,
  end_at timestamptz,
  status public.deal_status not null default 'draft',
  is_featured boolean not null default false,
  is_sponsored boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.deal_products (
  deal_id uuid not null references public.deals(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  primary key (deal_id, product_id)
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  mall_id uuid not null references public.malls(id) on delete cascade,
  store_id uuid references public.stores(id) on delete set null,
  title text not null,
  description text,
  image_url text,
  start_at timestamptz,
  end_at timestamptz,
  location_text text,
  status public.account_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  mall_id uuid references public.malls(id) on delete cascade,
  store_id uuid references public.stores(id) on delete cascade,
  deal_id uuid references public.deals(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (
    ((mall_id is not null)::int +
     (store_id is not null)::int +
     (deal_id is not null)::int) = 1
  ),
  primary key (user_id, mall_id, store_id, deal_id)
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references public.profiles(id) on delete set null,
  mall_id uuid references public.malls(id) on delete set null,
  store_id uuid references public.stores(id) on delete set null,
  name text not null,
  goal text,
  target_location text,
  target_mall_id uuid references public.malls(id) on delete set null,
  target_interest text,
  target_age_min int,
  target_age_max int,
  budget numeric(14,2),
  duration_days int,
  status public.campaign_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.advertisements (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  placement text not null,
  social_channel text,
  creative_url text,
  status public.campaign_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  type text,
  deeplink text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  store_id uuid references public.stores(id) on delete cascade,
  mall_id uuid references public.malls(id) on delete cascade,
  plan public.subscription_plan not null,
  status public.account_status not null default 'active',
  started_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  campaign_id uuid references public.campaigns(id) on delete set null,
  amount numeric(14,2) not null,
  currency text not null default 'IDR',
  status text not null default 'pending',
  provider text,
  provider_reference text,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete set null,
  mall_id uuid references public.malls(id) on delete set null,
  store_id uuid references public.stores(id) on delete set null,
  deal_id uuid references public.deals(id) on delete set null,
  event_name text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_stores_mall_id on public.stores(mall_id);
create index if not exists idx_products_store_id on public.products(store_id);
create index if not exists idx_deals_store_id on public.deals(store_id);
create index if not exists idx_deals_mall_id on public.deals(mall_id);
create index if not exists idx_events_mall_id on public.events(mall_id);
create index if not exists idx_analytics_created_at on public.analytics_events(created_at);
create index if not exists idx_notifications_user_id on public.notifications(user_id);

alter table public.profiles enable row level security;
alter table public.malls enable row level security;
alter table public.stores enable row level security;
alter table public.store_staff enable row level security;
alter table public.products enable row level security;
alter table public.deals enable row level security;
alter table public.deal_products enable row level security;
alter table public.events enable row level security;
alter table public.favorites enable row level security;
alter table public.campaigns enable row level security;
alter table public.advertisements enable row level security;
alter table public.notifications enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.analytics_events enable row level security;

create policy "public can view active malls"
on public.malls for select
using (status = 'active');

create policy "public can view active stores"
on public.stores for select
using (status = 'active');

create policy "public can view active products"
on public.products for select
using (status = 'active');

create policy "public can view active deals"
on public.deals for select
using (status = 'active');

create policy "public can view active events"
on public.events for select
using (status = 'active');

create policy "users can view their profile"
on public.profiles for select
using (auth.uid() = id);

create policy "users can update their profile"
on public.profiles for update
using (auth.uid() = id);

create policy "users can manage their own favorites"
on public.favorites for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users can view their notifications"
on public.notifications for select
using (auth.uid() = user_id);

create policy "users can update their notifications"
on public.notifications for update
using (auth.uid() = user_id);

-- Business access policies can be tightened further after login/role management
-- is connected in Step 14.12.
