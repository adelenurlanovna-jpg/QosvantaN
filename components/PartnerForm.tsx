"use client";

import { useState } from "react";

const SEGMENTS = [
  { slug: "business", label: "Business" },
  { slug: "high_risk_fiat", label: "High Risk Fiat" },
  { slug: "high_risk_crypto", label: "High Risk Crypto" },
  { slug: "alternative_dark", label: "Alternative / Dark" },
] as const;

type Status = "idle" | "sending" | "success" | "error";

export default function PartnerForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      company_name: fd.get("company_name"),
      website_url: fd.get("website_url"),
      segment_slug: fd.get("segment_slug") || null,
      contact_name: fd.get("contact_name"),
      contact_email: fd.get("contact_email"),
      contact_telegram: fd.get("contact_telegram"),
      description: fd.get("description"),
      hp_company: fd.get("hp_company"),
    };

    try {
      const res = await fetch("/api/partners", {
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
      setErrorMsg("Network error. Please try again later.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-2xl p-8 lg:p-10 text-center"
        style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}
      >
        <div className="text-4xl mb-3">✅</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#0F172A" }}>
          Your application has been received
        </h2>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex px-5 py-2 rounded-lg text-sm font-medium transition"
          style={{ background: "#3B82F6", color: "#FFFFFF" }}
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl p-8 lg:p-10 space-y-5"
      style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}
    >
      <Field label="Company name *" name="company_name" required />
      <Field label="Website *" name="website_url" type="url" placeholder="https://" required />

      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "#0F172A" }}>
          Segment
        </label>
        <select
          name="segment_slug"
          defaultValue=""
          className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition"
          style={{ background: "#F7F9FC", border: "1px solid rgba(15,23,42,0.12)", color: "#0F172A" }}
        >
          <option value="">— Select a segment —</option>
          {SEGMENTS.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Contact name" name="contact_name" />
        <Field label="Email *" name="contact_email" type="email" required />
      </div>

      <Field label="Telegram" name="contact_telegram" placeholder="@username" />

      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "#0F172A" }}>
          About your company / message
        </label>
        <textarea
          name="description"
          rows={4}
          placeholder="Tell us briefly: which payment methods you offer, which countries and segments you serve"
          className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition resize-none"
          style={{ background: "#F7F9FC", border: "1px solid rgba(15,23,42,0.12)", color: "#0F172A" }}
        />
      </div>

      {/* Honeypot — hidden from real users, bots fill it */}
      <div aria-hidden style={{ position: "absolute", left: "-10000px", width: "1px", height: "1px", overflow: "hidden" }}>
        <label>
          Leave this empty
          <input type="text" name="hp_company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="flex items-start gap-2 text-sm leading-snug" style={{ color: "#475569" }}>
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 shrink-0"
          style={{ accentColor: "#0F172A" }}
        />
        <span>
          I agree to the processing of my data in accordance with the{" "}
          <a href="/privacy-policy" className="underline" style={{ color: "#0F172A" }}>Privacy Policy</a>{" "}
          and{" "}
          <a href="/terms" className="underline" style={{ color: "#0F172A" }}>Terms</a>.
        </span>
      </label>

      {status === "error" && (
        <p className="text-sm" style={{ color: "#DC2626" }}>
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold transition disabled:opacity-60"
        style={{ background: "#0F172A", color: "#FFFFFF" }}
      >
        {status === "sending" ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "#0F172A" }}>
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition"
        style={{ background: "#F7F9FC", border: "1px solid rgba(15,23,42,0.12)", color: "#0F172A" }}
      />
    </div>
  );
}
