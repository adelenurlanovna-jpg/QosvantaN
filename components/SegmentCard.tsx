"use client";
import Link from "next/link";
import { useState } from "react";

type Segment = {
  slug: string; title: string; subtitle: string; description: string;
  examples: string[]; icon: string; accent: string; border: string; glow: string;
};

export function SegmentCard({ seg }: { seg: Segment }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={`/search?segment=${seg.slug}`}
      className="group block rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: hovered ? seg.glow : "#FFFFFF",
        border: `1px solid ${hovered ? seg.border : "rgba(15,23,42,0.08)"}`,
        boxShadow: hovered
          ? `0 12px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)`
          : "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.03)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-5"
        style={{ background: `${seg.accent}12` }}
      >
        {seg.icon}
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: seg.accent }}>
        {seg.subtitle}
      </p>
      <h3 className="text-base font-bold mb-2" style={{ color: "#0D0F1E" }}>{seg.title}</h3>
      <p className="text-xs leading-relaxed mb-5" style={{ color: "#6B7280" }}>{seg.description}</p>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {seg.examples.map((ex) => (
          <span
            key={ex}
            className="text-xs px-2 py-0.5 rounded-md"
            style={{
              background: "rgba(15,23,42,0.04)",
              color: "#6B7280",
              border: "1px solid rgba(15,23,42,0.07)",
            }}
          >
            {ex}
          </span>
        ))}
      </div>
      <p
        className="text-xs font-semibold flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
        style={{ color: seg.accent }}
      >
        View providers <span>→</span>
      </p>
    </Link>
  );
}
