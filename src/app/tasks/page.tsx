"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TaskList } from "@/components/TaskList";
import type { Task } from "@/lib/types";

type StatusFilter = "all" | "pending" | "in_progress" | "completed" | "failed";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    const fetchTasks = async () => {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("status", filter);
      params.set("limit", "50");

      const res = await fetch(`/api/tasks?${params}`);
      const data = await res.json();
      setTasks(data.tasks);
      setTotal(data.total);
      setLoading(false);
    };

    fetchTasks();
    const interval = setInterval(fetchTasks, 15000);
    return () => clearInterval(interval);
  }, [filter]);

  const filters: { value: StatusFilter; label: string; color: string }[] = [
    { value: "all", label: "All", color: "bg-zinc-600" },
    { value: "pending", label: "Pending", color: "bg-yellow-500" },
    { value: "in_progress", label: "In Progress", color: "bg-blue-500" },
    { value: "completed", label: "Completed", color: "bg-green-500" },
    { value: "failed", label: "Failed", color: "bg-red-500" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800 sticky top-0 bg-black/90 backdrop-blur-sm z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              <span className="text-blue-400">ATON</span>
              <span className="text-zinc-500">CRUX</span>
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-400">Tasks</span>
          </div>
          <div className="text-sm text-zinc-500">{total} total</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filters.map(({ value, label, color }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                filter === value
                  ? "bg-zinc-800 text-white"
                  : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${color}`} />
              {label}
            </button>
          ))}
        </div>

        {/* Task List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <TaskList tasks={tasks} showStatus={filter === "all"} />
        )}
      </main>
    </div>
  );
}
