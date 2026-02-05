"use client";

import Link from "next/link";
import type { Task } from "@/lib/types";

interface TaskListProps {
  tasks: Task[];
  showStatus?: boolean;
}

const statusConfig = {
  pending: { color: "bg-yellow-500", label: "Pending" },
  in_progress: { color: "bg-blue-500", label: "In Progress" },
  completed: { color: "bg-green-500", label: "Completed" },
  failed: { color: "bg-red-500", label: "Failed" },
};

function formatTime(timestamp: string | null) {
  if (!timestamp) return "-";
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString();
}

export function TaskList({ tasks, showStatus = true }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500">
        No tasks found
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => {
        const status = statusConfig[task.status];
        return (
          <Link
            key={task.id}
            href={`/tasks/${task.id}`}
            className="block bg-zinc-900 hover:bg-zinc-800 rounded-lg p-4 border border-zinc-800 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {showStatus && (
                    <div className={`w-2 h-2 rounded-full ${status.color}`} />
                  )}
                  <span className="font-medium text-white truncate">
                    {task.title}
                  </span>
                </div>
                {task.description && (
                  <p className="text-sm text-zinc-400 line-clamp-2">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                  <span>Source: {task.source}</span>
                  <span>Priority: {task.priority}</span>
                </div>
              </div>
              <div className="text-right text-xs text-zinc-500 shrink-0">
                <div>{formatTime(task.created_at)}</div>
                {showStatus && (
                  <div className="mt-1 text-zinc-600">{status.label}</div>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
