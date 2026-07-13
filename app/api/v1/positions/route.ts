import { getPositions } from "@/lib/mock-data";
import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const side = (request.nextUrl.searchParams.get("side") as "ALL" | "YES" | "NO" | null) ?? "ALL";
  const platform = (request.nextUrl.searchParams.get("platform") as "ALL" | "PM" | "KS" | "OL" | null) ?? "ALL";

  return NextResponse.json(getPositions(side, platform));
}
