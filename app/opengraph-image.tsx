import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Qosvanta — Payment Solutions Marketplace";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #312E81 100%)",
          fontFamily: "system-ui, sans-serif",
          color: "#FFFFFF",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #3B82F6, #7C3AED)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 800,
            }}
          >
            Q
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em" }}>Qosvanta</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: 999,
              background: "rgba(59,130,246,0.18)",
              border: "1px solid rgba(59,130,246,0.3)",
              alignSelf: "flex-start",
              fontSize: 18,
              fontWeight: 500,
              color: "#93C5FD",
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "#3B82F6" }} />
            Global Payment Provider Directory
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: 900,
            }}
          >
            Payment Solutions{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #60A5FA, #A78BFA)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Marketplace
            </span>
          </div>
          <div style={{ fontSize: 28, color: "#CBD5E1", maxWidth: 920, lineHeight: 1.35 }}>
            Compare 200+ crypto, high-risk, iGaming and local payment providers — in one place.
          </div>
        </div>

        <div style={{ display: "flex", gap: 32, fontSize: 20, color: "#94A3B8" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ color: "#3B82F6", fontWeight: 700 }}>200+</span> Providers
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ color: "#7C3AED", fontWeight: 700 }}>190+</span> Countries
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ color: "#06B6D4", fontWeight: 700 }}>50+</span> Methods
          </div>
        </div>
      </div>
    ),
    size,
  );
}
