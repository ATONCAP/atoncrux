"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import type { Task, Session } from "@/lib/types";

const statusConfig = {
  pending: { color: "bg-yellow-500", label: "Pending" },
  in_progress: { color: "bg-blue-500", label: "In Progress" },
  completed: { color: "bg-green-500", label: "Completed" },
  failed: { color: "bg-red-500", label: "Failed" },
  running: { color: "bg-blue-500", label: "Running" },
};

function formatDate(timestamp: string | null) {
  if (!timestamp) return "-";
  return new Date(timestamp).toLocaleString();
}

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [task, setTask] = useState<Task | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      const res = await fetch(`/api/tasks/${id}`);
      if (!res.ok) {
        setError("Task not found");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setTask(data.task);
      setSessions(data.sessions);
      setLoading(false);
    };

    fetchTask();
    const interval = setInterval(fetchTask, 10000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">{error ?? "Task not found"}</div>
          <Link href="/tasks" className="text-blue-400 hover:text-blue-300">
            ← Back to tasks
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[task.status];

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800 sticky top-0 bg-black/90 backdrop-blur-sm z-50">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <Link href="/" className="hover:text-white">
              <span className="text-blue-400">ATON</span>
              <span className="text-zinc-500">CRUX</span>
            </Link>
            <span>/</span>
            <Link href="/tasks" className="hover:text-white">
              Tasks
            </Link>
            <span>/</span>
            <span className="text-zinc-300 truncate max-w-[200px]">
              {task.title}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Task Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-3 h-3 rounded-full ${status.color}`} />
            <span className="text-sm text-zinc-400">{status.label}</span>
          </div>
          <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
          {task.description && (
            <p className="text-zinc-400 whitespace-pre-wrap">{task.description}</p>
          )}
        </div>

        {/* Task Details */}
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 mb-8">
          <h2 className="text-lg font-semibold mb-4">Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-zinc-500">Source</div>
              <div className="font-mono">{task.source}</div>
            </div>
            <div>
              <div className="text-zinc-500">Priority</div>
              <div>{task.priority}</div>
            </div>
            <div>
              <div className="text-zinc-500">Created</div>
              <div>{formatDate(task.created_at)}</div>
            </div>
            <div>
              <div className="text-zinc-500">Started</div>
              <div>{formatDate(task.started_at)}</div>
            </div>
            {task.completed_at && (
              <div>
                <div className="text-zinc-500">Completed</div>
                <div>{formatDate(task.completed_at)}</div>
              </div>
            )}
          </div>
        </div>

        {/* Sessions */}
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <h2 className="text-lg font-semibold mb-4">
            Sessions ({sessions.length})
          </h2>
          {sessions.length === 0 ? (
            <div className="text-zinc-500 text-sm">No sessions yet</div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => {
                const sessionStatus =
                  statusConfig[session.status as keyof typeof statusConfig] ??
                  statusConfig.pending;
                return (
                  <div
                    key={session.id}
                    className="bg-zinc-800 rounded-lg p-4 border border-zinc-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${sessionStatus.color}`}
                        />
                        <span className="text-sm">{sessionStatus.label}</span>
                      </div>
                      <div className="text-xs text-zinc-500 font-mono">
                        {session.id.slice(0, 8)}...
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-zinc-400">
                      <div>
                        <span className="text-zinc-500">Started:</span>{" "}
                        {formatDate(session.started_at)}
                      </div>
                      {session.completed_at && (
                        <div>
                          <span className="text-zinc-500">Completed:</span>{" "}
                          {formatDate(session.completed_at)}
                        </div>
                      )}
                      {session.pid && (
                        <div>
                          <span className="text-zinc-500">PID:</span> {session.pid}
                        </div>
                      )}
                      {session.tokens_used && (
                        <div>
                          <span className="text-zinc-500">Tokens:</span>{" "}
                          {session.tokens_used.toLocaleString()}
                        </div>
                      )}
                    </div>
                    {session.result && (
                      <div className="mt-2 text-xs text-zinc-400 bg-zinc-900 rounded p-2">
                        {session.result}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
