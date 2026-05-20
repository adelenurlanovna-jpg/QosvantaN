"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function ReviewActions({ processorId }: { processorId: string }) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState<"approved" | "rejected" | null>(null);
  const router = useRouter();

  const act = (decision: "approve" | "reject") => {
    startTransition(async () => {
      const resp = await fetch("/api/admin/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ processorId, decision }),
      });
      if (resp.ok) {
        setDone(decision === "approve" ? "approved" : "rejected");
        setTimeout(() => router.refresh(), 400);
      } else {
        alert("Action failed: " + (await resp.text()));
      }
    });
  };

  if (done) {
    return (
      <span className="text-xs px-3 py-1.5 rounded-md font-semibold shrink-0"
            style={{ background: done === "approved" ? "rgba(5,150,105,0.10)" : "rgba(239,68,68,0.10)",
                     color: done === "approved" ? "#059669" : "#DC2626" }}>
        {done === "approved" ? "✓ Approved" : "✗ Rejected"}
      </span>
    );
  }

  return (
    <div className="flex gap-2 shrink-0">
      <button
        onClick={() => act("approve")}
        disabled={pending}
        className="text-xs px-3 py-1.5 rounded-md font-semibold disabled:opacity-50"
        style={{ background: "#059669", color: "white" }}
      >
        ✓ Approve
      </button>
      <button
        onClick={() => act("reject")}
        disabled={pending}
        className="text-xs px-3 py-1.5 rounded-md font-semibold disabled:opacity-50"
        style={{ background: "white", color: "#DC2626", border: "1px solid #DC2626" }}
      >
        ✗ Reject
      </button>
    </div>
  );
}
