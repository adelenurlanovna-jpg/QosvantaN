-- Security fixes:
-- 1. provider_applications: only admins (or service_role) can read/update.
--    Public can still INSERT (form submissions).
-- 2. processors: only status='active' visible to anon. Admin sees everything.

-- ---- provider_applications ----
drop policy if exists "Authenticated can view applications" on provider_applications;
drop policy if exists "Authenticated can update applications" on provider_applications;

create policy "admin read provider applications"
  on provider_applications for select
  using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true)
  );

create policy "admin update provider applications"
  on provider_applications for update
  using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true)
  );

-- ---- processors ----
drop policy if exists "public read active and pending processors" on processors;

create policy "public read active processors"
  on processors for select
  using (status = 'active');

create policy "admin read all processors"
  on processors for select
  using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true)
  );
