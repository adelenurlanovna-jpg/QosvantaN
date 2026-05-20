-- Security audit log: structured trail of all sensitive actions.
-- Inserted from server-side code (service_role or authenticated admin context).
-- Read-only to admins; service_role bypasses RLS for ingestion.

create table if not exists audit_log (
  id            bigserial primary key,
  created_at    timestamptz not null default now(),
  actor_id      uuid references auth.users(id) on delete set null,
  actor_email   text,
  action        text not null,           -- e.g. 'admin.review.approve', 'admin.review.reject', 'admin.review.forbidden'
  resource      text,                    -- e.g. 'processor', 'provider_application'
  resource_id   text,                    -- free-form id of the target resource
  ip            text,
  user_agent    text,
  metadata      jsonb not null default '{}'::jsonb,
  outcome       text not null default 'ok' check (outcome in ('ok','denied','error'))
);

create index if not exists audit_log_created_at_idx on audit_log (created_at desc);
create index if not exists audit_log_actor_idx      on audit_log (actor_id, created_at desc);
create index if not exists audit_log_action_idx     on audit_log (action, created_at desc);

alter table audit_log enable row level security;

drop policy if exists "admin read audit_log" on audit_log;
create policy "admin read audit_log"
  on audit_log for select
  using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true)
  );

drop policy if exists "service write audit_log" on audit_log;
create policy "service write audit_log"
  on audit_log for insert
  with check (auth.role() = 'service_role');
