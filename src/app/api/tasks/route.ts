import { NextResponse, type NextRequest } from "next/server";
import { query } from "@/lib/db";
import type { Task } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 200);
  const offset = parseInt(searchParams.get("offset") ?? "0");

  let whereClause = "";
  const params: unknown[] = [];

  if (status) {
    whereClause = "WHERE status = $1";
    params.push(status);
  }

  const tasks = await query<Task>(
    `SELECT * FROM tasks ${whereClause}
     ORDER BY
       CASE status
         WHEN 'in_progress' THEN 0
         WHEN 'pending' THEN 1
         WHEN 'completed' THEN 2
         WHEN 'failed' THEN 3
       END,
       priority ASC,
       created_at DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );

  const countResult = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM tasks ${whereClause}`,
    params
  );
  const total = parseInt(countResult[0]?.count ?? "0");

  return NextResponse.json(
    { tasks, total, limit, offset },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
