import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type AuditOutcome = "ok" | "denied" | "error";

export interface AuditEntry {
  action: string;
  outcome?: AuditOutcome;
  actor_id?: string | null;
  actor_email?: string | null;
  resource?: string | null;
  resource_id?: string | null;
  ip?: string | null;
  user_agent?: string | null;
  metadata?: Record<string, unknown>;
}

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient<Database>(url, key, { auth: { persistSession: false } });
}

export async function audit(entry: AuditEntry, req?: Request) {
  const sb = serviceClient();
  if (!sb) return;

  const headers = req?.headers;
  const ip =
    entry.ip ??
    headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers?.get("x-real-ip") ??
    null;
  const ua = entry.user_agent ?? headers?.get("user-agent") ?? null;

  try {
    await sb.from("audit_log" as never).insert({
      action: entry.action,
      outcome: entry.outcome ?? "ok",
      actor_id: entry.actor_id ?? null,
      actor_email: entry.actor_email ?? null,
      resource: entry.resource ?? null,
      resource_id: entry.resource_id ?? null,
      ip,
      user_agent: ua,
      metadata: entry.metadata ?? {},
    } as never);
  } catch {
    // never let audit logging break the request
  }
}
