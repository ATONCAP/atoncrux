import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import type { Heartbeat, Task, Event, DashboardStatus } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const heartbeat = await queryOne<Heartbeat>(
    `SELECT * FROM heartbeat ORDER BY timestamp DESC LIMIT 1`
  );

  const isOnline =
    heartbeat !== null &&
    new Date(heartbeat.timestamp).getTime() > Date.now() - 2 * 60 * 1000;

  const recentTasks = await query<Task>(
    `SELECT * FROM tasks ORDER BY
      CASE status
        WHEN 'in_progress' THEN 0
        WHEN 'pending' THEN 1
        WHEN 'completed' THEN 2
        WHEN 'failed' THEN 3
      END,
      created_at DESC
    LIMIT 10`
  );

  const recentEvents = await query<Event>(
    `SELECT * FROM events ORDER BY timestamp DESC LIMIT 20`
  );

  const response: DashboardStatus = {
    online: isOnline,
    lastSeen: heartbeat?.timestamp ?? null,
    daemonPid: heartbeat?.daemon_pid ?? null,
    daemonVersion: heartbeat?.daemon_version ?? null,
    channels: heartbeat?.channels ?? {
      telegram: false,
      imessage: false,
      signal: false,
    },
    taskCounts: heartbeat?.task_counts ?? {
      pending: 0,
      in_progress: 0,
      completed: 0,
      failed: 0,
    },
    activeTask: heartbeat?.active_session_id
      ? {
          id: heartbeat.active_session_id,
          title: heartbeat.active_task_title ?? "Unknown",
          sessionId: heartbeat.active_session_id,
        }
      : null,
    recentTasks,
    recentEvents,
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
