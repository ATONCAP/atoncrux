import { NextResponse, type NextRequest } from "next/server";
import { query, queryOne } from "@/lib/db";
import type { Task, Session } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const task = await queryOne<Task>(
    `SELECT * FROM tasks WHERE id = $1`,
    [id]
  );

  if (!task) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }

  const sessions = await query<Session>(
    `SELECT * FROM sessions WHERE task_id = $1 ORDER BY started_at DESC`,
    [id]
  );

  return NextResponse.json(
    { task, sessions },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
