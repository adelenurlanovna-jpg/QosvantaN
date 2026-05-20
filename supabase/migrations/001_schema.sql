-- PayMap Database Schema
create extension if not exists "uuid-ossp";

-- ============================================================
-- GROUP 1: CORE
-- ============================================================

create table if not exists segments (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  display_name text not null,
  description text,
  ui_tone text not null,
  requires_tos_acceptance boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists payment_methods (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  type text not null check (type in ('fiat', 'crypto', 'local', 'bank')),
  icon_url text,
  created_at timestamptz not null default now()
);

create table if not exists verticals (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  display_name text not null,
  risk_level text not null check (risk_level in ('low', 'medium', 'high', 'very_high')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- GROUP 2: GEO
-- ============================================================

create table if not exists countries (
  id uuid primary key default uuid_generate_v4(),
  code char(2) unique not null,
  name text not null,
  name_ru text,
  region text not null check (region in ('eu', 'apac', 'latam', 'africa', 'mena', 'cis', 'na', 'oceania')),
  fatf_status text not null default 'compliant' check (fatf_status in ('compliant', 'grey_list', 'black_list')),
  is_sanctioned boolean not null default false,
  sanction_details text,
  dominant_payment_methods text[],
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists countries_code_idx on countries (code);
create index if not exists countries_fatf_idx on countries (fatf_status);
create index if not exists countries_sanctioned_idx on countries (is_sanctioned);

-- ============================================================
-- GROUP 3: PROCESSORS
-- ============================================================

create table if not exists processors (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  segment_id uuid not null references segments (id),
  description text,
  website_url text,
  scraper_url text,
  logo_url text,
  kyc_level text not null default 'standard' check (kyc_level in ('none', 'basic', 'standard', 'full')),
  onboarding_days_min int,
  onboarding_days_max int,
  api_quality_score int check (api_quality_score between 1 and 5),
  is_verified boolean not null default false,
  is_featured boolean not null default false,
  status text not null default 'pending_review' check (status in ('active', 'inactive', 'pending_review', 'flagged')),
  last_scraped_at timestamptz,
  last_verified_at timestamptz,
  page_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists processors_segment_idx on processors (segment_id);
create index if not exists processors_status_idx on processors (status);
create index if not exists processors_verified_idx on processors (is_verified);
create index if not exists processors_featured_idx on processors (is_featured);

-- ============================================================
-- GROUP 4: MANY-TO-MANY RELATIONS
-- ============================================================

create table if not exists processor_payment_methods (
  processor_id uuid not null references processors (id) on delete cascade,
  payment_method_id uuid not null references payment_methods (id) on delete cascade,
  primary key (processor_id, payment_method_id)
);

create table if not exists processor_countries (
  processor_id uuid not null references processors (id) on delete cascade,
  country_id uuid not null references countries (id) on delete cascade,
  role text not null check (role in ('client_geo', 'license_jurisdiction', 'settlement_destination')),
  is_supported boolean not null default true,
  notes text,
  primary key (processor_id, country_id, role)
);

create index if not exists proc_countries_country_idx on processor_countries (country_id, role);

create table if not exists processor_verticals (
  processor_id uuid not null references processors (id) on delete cascade,
  vertical_id uuid not null references verticals (id) on delete cascade,
  approval_likelihood text not null default 'medium' check (approval_likelihood in ('low', 'medium', 'high', 'confirmed')),
  notes text,
  primary key (processor_id, vertical_id)
);

create index if not exists proc_verticals_vertical_idx on processor_verticals (vertical_id, approval_likelihood);

-- ============================================================
-- GROUP 5: PRICING
-- ============================================================

create table if not exists volume_tiers (
  id uuid primary key default uuid_generate_v4(),
  processor_id uuid not null references processors (id) on delete cascade,
  volume_min_usd numeric not null default 0,
  volume_max_usd numeric,
  fee_percentage numeric,
  fee_fixed_usd numeric,
  settlement_currency text[],
  settlement_days_min int,
  settlement_days_max int,
  rolling_reserve_percentage numeric,
  rolling_reserve_days int,
  chargeback_limit_percentage numeric,
  transaction_limit_usd numeric,
  monthly_volume_limit_usd numeric,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists volume_tiers_processor_idx on volume_tiers (processor_id);
create index if not exists volume_tiers_volume_idx on volume_tiers (volume_min_usd, volume_max_usd);

-- ============================================================
-- GROUP 6: USER DATA
-- ============================================================

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  is_verified boolean not null default false,
  verification_method text check (verification_method in ('email_domain', 'manual')),
  segment_preference uuid references segments (id),
  tos_accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  processor_id uuid not null references processors (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  body text,
  pros text,
  cons text,
  use_case text,
  is_verified boolean not null default false,
  moderation_status text not null default 'pending' check (moderation_status in ('pending', 'approved', 'rejected', 'flagged')),
  moderation_notes text,
  helpful_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reviews_processor_idx on reviews (processor_id, moderation_status);

create table if not exists user_alerts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles (id) on delete cascade,
  processor_id uuid not null references processors (id) on delete cascade,
  alert_types text[] not null,
  is_active boolean not null default true,
  last_triggered_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists saved_cascades (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles (id) on delete cascade,
  name text not null,
  steps jsonb not null,
  target_country_id uuid references countries (id),
  vertical_id uuid references verticals (id),
  monthly_volume_usd numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- GROUP 7: PRESETS
-- ============================================================

create table if not exists presets (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  segment_id uuid references segments (id),
  target_region text,
  vertical_id uuid references verticals (id),
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists preset_processors (
  preset_id uuid not null references presets (id) on delete cascade,
  processor_id uuid not null references processors (id) on delete cascade,
  role text not null check (role in ('primary', 'backup', 'fallback')),
  sort_order int not null default 0,
  notes text,
  primary key (preset_id, processor_id)
);

-- ============================================================
-- GROUP 8: AUTOMATION
-- ============================================================

create table if not exists scraper_jobs (
  id uuid primary key default uuid_generate_v4(),
  processor_id uuid not null references processors (id) on delete cascade,
  target_url text not null,
  last_run_at timestamptz,
  last_success_at timestamptz,
  next_run_at timestamptz,
  status text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed', 'changes_detected')),
  page_hash_before text,
  page_hash_after text,
  changes_detected boolean not null default false,
  raw_content text,
  error_message text,
  created_at timestamptz not null default now()
);

create table if not exists data_change_log (
  id uuid primary key default uuid_generate_v4(),
  processor_id uuid references processors (id) on delete set null,
  table_name text not null,
  field_name text not null,
  old_value text,
  new_value text,
  source text not null check (source in ('scraper', 'manual', 'community_report')),
  confirmed_by uuid references profiles (id) on delete set null,
  change_type text not null check (change_type in ('update', 'create', 'delete')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists processors_updated_at on processors;
create trigger processors_updated_at
  before update on processors
  for each row execute function update_updated_at();

drop trigger if exists reviews_updated_at on reviews;
create trigger reviews_updated_at
  before update on reviews
  for each row execute function update_updated_at();

drop trigger if exists saved_cascades_updated_at on saved_cascades;
create trigger saved_cascades_updated_at
  before update on saved_cascades
  for each row execute function update_updated_at();
