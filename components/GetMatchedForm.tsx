"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function GetMatchedForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      business_type: ((fd.get("business_type") as string) || "").trim(),
      target_geo: ((fd.get("target_geo") as string) || "").trim(),
      monthly_volume: ((fd.get("monthly_volume") as string) || "").trim(),
      payment_types: ((fd.get("payment_types") as string) || "").trim(),
      contact_email: ((fd.get("contact_email") as string) || "").trim(),
      hp_company: ((fd.get("hp_company") as string) || "").trim(),
    };

    if (!payload.contact_email) {
      setErrorMsg("Please add your email so we can respond.");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || "Something went wrong");
        setStatus("error");
        return;
      }
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="glass-card p-6 text-center">
        <div className="text-3xl mb-3">✅</div>
        <p className="text-base font-semibold mb-2" style={{ color: "#F1F5F9" }}>
          Your request has been received
        </p>
        <p className="text-sm" style={{ color: "#94A3B8" }}>
          We'll review your details and email you a shortlist within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 inline-flex px-4 py-2 rounded-lg text-xs font-medium"
          style={{ background: "rgba(255,255,255,0.08)", color: "#F1F5F9" }}
        >
          Send another
        </button>
      </div>
    );
  }

  const fields: { name: string; label: string; placeholder: string; required: boolean; type?: string }[] = [
    { name: "business_type", label: "Business type", placeholder: "e.g. E-commerce, SaaS, Crypto exchange", required: true },
    { name: "target_geo", label: "Target countries / regions", placeholder: "e.g. Brazil, Southeast Asia, EU", required: false },
    { name: "monthly_volume", label: "Monthly volume (USD)", placeholder: "e.g. $50,000", required: false },
    { name: "payment_types", label: "Payment types needed", placeholder: "e.g. Cards, local bank transfer, crypto", required: false },
    { name: "contact_email", label: "Your email *", placeholder: "you@company.com", required: true, type: "email" },
  ];

  return (
    <form onSubmit={onSubmit} className="glass-card p-6">
      <p className="text-sm font-semibold mb-5" style={{ color: "#F1F5F9" }}>Get your provider shortlist</p>

      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#94A3B8" }}>
              {field.label}
            </label>
            <input
              name={field.name}
              type={field.type ?? "text"}
              placeholder={field.placeholder}
              required={field.required}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all focus:border-white/30"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#F1F5F9",
              }}
            />
          </div>
        ))}

        {/* Honeypot — hidden from real users, bots fill it */}
        <div aria-hidden style={{ position: "absolute", left: "-10000px", width: "1px", height: "1px", overflow: "hidden" }}>
          <label>
            Company website (leave empty)
            <input type="text" name="hp_company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <label className="flex items-start gap-2 mt-2 text-xs leading-snug" style={{ color: "#94A3B8" }}>
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-0.5 shrink-0"
            style={{ accentColor: "#3B82F6" }}
          />
          <span>
            I agree to the processing of my data in accordance with the{" "}
            <a href="/privacy-policy" className="underline" style={{ color: "#C9A84C" }}>Privacy Policy</a>{" "}
            and{" "}
            <a href="/terms" className="underline" style={{ color: "#C9A84C" }}>Terms</a>.
          </span>
        </label>

        {status === "error" && (
          <p className="text-xs" style={{ color: "#FCA5A5" }}>{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="block w-full text-center py-3 rounded-xl text-sm font-semibold text-white mt-2 transition-all hover:opacity-90 disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)" }}
        >
          {status === "sending" ? "Sending…" : "Get matched →"}
        </button>
        <p className="text-center text-xs mt-2" style={{ color: "#475569" }}>
          We respond within 24 hours. Free for merchants.
        </p>
      </div>
    </form>
  );
}
