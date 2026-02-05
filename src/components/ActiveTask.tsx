"use client";

import Link from "next/link";

interface ActiveTaskProps {
  task: {
    id: string;
    title: string;
    sessionId: string;
  } | null;
}

export function ActiveTask({ task }: ActiveTaskProps) {
  return (
    <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
      <h3 className="text-sm font-medium text-zinc-400 mb-3">Currently Working On</h3>

      {task ? (
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="relative mt-1">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-blue-500 animate-ping opacity-75" />
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/tasks/${task.id}`}
                className="text-white font-medium hover:text-blue-400 transition-colors block truncate"
              >
                {task.title}
              </Link>
              <div className="text-xs text-zinc-500 mt-1 font-mono">
                Session: {task.sessionId.slice(0, 8)}...
              </div>
            </div>
          </div>

          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full animate-pulse"
              style={{ width: "60%" }}
            />
          </div>
        </div>
      ) : (
        <div className="text-zinc-500 text-sm italic">
          No active task. Waiting for next work item...
        </div>
      )}
    </div>
  );
}
