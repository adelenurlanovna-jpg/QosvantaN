import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSameOrigin } from "@/lib/security/origin";
import { audit } from "@/lib/security/audit";

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    await audit({ action: "admin.review.csrf_blocked", outcome: "denied" }, req);
    return new NextResponse("Forbidden", { status: 403 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    await audit({ action: "admin.review.unauthorized", outcome: "denied" }, req);
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!(profile as any)?.is_admin) {
    await audit({
      action: "admin.review.forbidden",
      outcome: "denied",
      actor_id: user.id,
      actor_email: user.email ?? null,
    }, req);
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { processorId, decision } = await req.json();
  if (!processorId || !["approve", "reject"].includes(decision)) {
    await audit({
      action: "admin.review.bad_request",
      outcome: "error",
      actor_id: user.id,
      actor_email: user.email ?? null,
      metadata: { processorId, decision },
    }, req);
    return new NextResponse("Bad request", { status: 400 });
  }

  const updates =
    decision === "approve"
      ? { status: "active", is_verified: true, last_verified_at: new Date().toISOString() }
      : { status: "inactive" };

  const { error } = await supabase
    .from("processors")
    .update(updates as any)
    .eq("id", processorId);

  if (error) {
    await audit({
      action: `admin.review.${decision}`,
      outcome: "error",
      actor_id: user.id,
      actor_email: user.email ?? null,
      resource: "processor",
      resource_id: String(processorId),
      metadata: { error: error.message },
    }, req);
    return new NextResponse(error.message, { status: 500 });
  }

  await supabase.from("data_change_log").insert({
    processor_id: processorId,
    table_name: "processors",
    field_name: "status",
    new_value: updates.status,
    source: "manual",
    confirmed_by: user.id,
    change_type: "update",
  } as any);

  await audit({
    action: `admin.review.${decision}`,
    outcome: "ok",
    actor_id: user.id,
    actor_email: user.email ?? null,
    resource: "processor",
    resource_id: String(processorId),
    metadata: { new_status: updates.status },
  }, req);

  return NextResponse.json({ ok: true });
}
