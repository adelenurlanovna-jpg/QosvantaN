import { ImageResponse } from "next/og";

export const runtime = "edge";

const ALLOWED = [256, 512, 1024] as const;
type Size = (typeof ALLOWED)[number];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ size: string }> },
) {
  const { size: sizeParam } = await params;
  const sizeNum = parseInt(sizeParam, 10);
  const size: Size = (ALLOWED as readonly number[]).includes(sizeNum) ? (sizeNum as Size) : 512;
  const inner = Math.round(size * 0.7);
  const fontSize = Math.round(size * 0.42);
  const radius = Math.round(size * 0.18);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFFFF",
        }}
      >
        <div
          style={{
            width: inner,
            height: inner,
            borderRadius: radius,
            background: "linear-gradient(135deg, #3B82F6, #7C3AED)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            fontSize,
            fontWeight: 800,
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            letterSpacing: "-0.05em",
          }}
        >
          Q
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}
