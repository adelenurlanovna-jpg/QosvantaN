-- ============================================================
-- Migration 010: RLS for admin review and pending_review visibility
-- ============================================================

-- Anon/auth users can read pending_review processors too (shown on /search with "Не проверено" badge)
drop policy if exists "public read active processors" on processors;
create policy "public read active and pending processors" on processors
  for select using (status in ('active', 'pending_review'));

-- Admins can update processors (approve/reject in /admin/review)
drop policy if exists "admin update processors" on processors;
create policy "admin update processors" on processors
  for update using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true)
  );

-- Admins can write audit entries when approving/rejecting
drop policy if exists "admin write change log" on data_change_log;
create policy "admin write change log" on data_change_log
  for insert with check (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true)
  );
