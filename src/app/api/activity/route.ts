import { NextResponse, type NextRequest } from "next/server";
import { query } from "@/lib/db";
import type { Event } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 200);
  const offset = parseInt(searchParams.get("offset") ?? "0");
  const eventType = searchParams.get("type");

  let whereClause = "";
  const params: unknown[] = [];

  if (eventType) {
    whereClause = "WHERE event_type = $1";
    params.push(eventType);
  }

  const events = await query<Event>(
    `SELECT * FROM events ${whereClause}
     ORDER BY timestamp DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );

  const countResult = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM events ${whereClause}`,
    params
  );
  const total = parseInt(countResult[0]?.count ?? "0");

  return NextResponse.json(
    { events, total, limit, offset },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
