-- Row Level Security policies for PayMap

-- Enable RLS on all tables
alter table segments               enable row level security;
alter table payment_methods        enable row level security;
alter table verticals              enable row level security;
alter table countries              enable row level security;
alter table processors             enable row level security;
alter table processor_payment_methods enable row level security;
alter table processor_countries    enable row level security;
alter table processor_verticals    enable row level security;
alter table volume_tiers           enable row level security;
alter table profiles               enable row level security;
alter table reviews                enable row level security;
alter table user_alerts            enable row level security;
alter table saved_cascades         enable row level security;
alter table presets                enable row level security;
alter table preset_processors      enable row level security;
alter table scraper_jobs           enable row level security;
alter table data_change_log        enable row level security;

-- ============================================================
-- PUBLIC READ — reference data (anyone can read)
-- ============================================================

create policy "public read segments"
  on segments for select using (true);

create policy "public read payment_methods"
  on payment_methods for select using (true);

create policy "public read verticals"
  on verticals for select using (true);

create policy "public read countries"
  on countries for select using (true);

create policy "public read active processors"
  on processors for select using (status = 'active');

create policy "public read processor_payment_methods"
  on processor_payment_methods for select using (true);

create policy "public read processor_countries"
  on processor_countries for select using (true);

create policy "public read processor_verticals"
  on processor_verticals for select using (true);

create policy "public read volume_tiers"
  on volume_tiers for select using (true);

create policy "public read presets"
  on presets for select using (true);

create policy "public read preset_processors"
  on preset_processors for select using (true);

create policy "public read approved reviews"
  on reviews for select using (moderation_status = 'approved');

-- ============================================================
-- SERVICE ROLE WRITE — reference and automation data
-- ============================================================

create policy "service write segments"
  on segments for all using (auth.role() = 'service_role');

create policy "service write payment_methods"
  on payment_methods for all using (auth.role() = 'service_role');

create policy "service write verticals"
  on verticals for all using (auth.role() = 'service_role');

create policy "service write countries"
  on countries for all using (auth.role() = 'service_role');

create policy "service write processors"
  on processors for all using (auth.role() = 'service_role');

create policy "service write processor_payment_methods"
  on processor_payment_methods for all using (auth.role() = 'service_role');

create policy "service write processor_countries"
  on processor_countries for all using (auth.role() = 'service_role');

create policy "service write processor_verticals"
  on processor_verticals for all using (auth.role() = 'service_role');

create policy "service write volume_tiers"
  on volume_tiers for all using (auth.role() = 'service_role');

create policy "service write presets"
  on presets for all using (auth.role() = 'service_role');

create policy "service write preset_processors"
  on preset_processors for all using (auth.role() = 'service_role');

create policy "service write scraper_jobs"
  on scraper_jobs for all using (auth.role() = 'service_role');

create policy "service write data_change_log"
  on data_change_log for all using (auth.role() = 'service_role');

-- ============================================================
-- AUTHENTICATED USERS — own data only
-- ============================================================

-- Profiles: user sees and edits only their own
create policy "user read own profile"
  on profiles for select using (auth.uid() = id);

create policy "user update own profile"
  on profiles for update using (auth.uid() = id);

create policy "user insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Reviews: any authenticated user can create; only own reviews editable
create policy "auth user create review"
  on reviews for insert with check (auth.uid() = user_id);

create policy "user read own reviews"
  on reviews for select using (auth.uid() = user_id);

create policy "user update own review"
  on reviews for update using (auth.uid() = user_id);

create policy "user delete own review"
  on reviews for delete using (auth.uid() = user_id);

-- Alerts: user manages only their own
create policy "user manage own alerts"
  on user_alerts for all using (auth.uid() = user_id);

-- Cascades: user manages only their own
create policy "user manage own cascades"
  on saved_cascades for all using (auth.uid() = user_id);

-- Scraper jobs: admin read only
create policy "admin read scraper_jobs"
  on scraper_jobs for select using (auth.role() = 'service_role');

-- Change log: admin read only
create policy "admin read data_change_log"
  on data_change_log for select using (auth.role() = 'service_role');
