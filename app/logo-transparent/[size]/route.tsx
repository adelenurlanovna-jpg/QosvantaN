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
  const fontSize = Math.round(size * 0.6);
  const radius = Math.round(size * 0.18);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #3B82F6, #7C3AED)",
          borderRadius: radius,
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
    ),
    { width: size, height: size },
  );
}
