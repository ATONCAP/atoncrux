"use client";

import { useDashboard } from "@/lib/useDashboard";
import { StatusIndicator } from "@/components/StatusIndicator";
import { ChannelsStatus } from "@/components/ChannelsStatus";
import { TaskCounts } from "@/components/TaskCounts";
import { ActiveTask } from "@/components/ActiveTask";
import { TaskList } from "@/components/TaskList";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import Link from "next/link";

export default function Dashboard() {
  const { status, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-zinc-400">Connecting to Aton...</div>
        </div>
      </div>
    );
  }

  if (error && !status) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">Connection Error</div>
          <div className="text-zinc-400">{error}</div>
        </div>
      </div>
    );
  }

  if (!status) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 sticky top-0 bg-black/90 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-blue-400">ATON</span>
              <span className="text-zinc-500">CRUX</span>
            </h1>
            <div className="text-xs text-zinc-600 font-mono">
              v{status.daemonVersion ?? "?"}
            </div>
          </div>
          <StatusIndicator online={status.online} lastSeen={status.lastSeen} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Status */}
          <div className="space-y-6">
            <ActiveTask task={status.activeTask} />
            <TaskCounts counts={status.taskCounts} />
            <ChannelsStatus channels={status.channels} />
          </div>

          {/* Middle Column - Tasks */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Tasks</h2>
              <Link
                href="/tasks"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                View all →
              </Link>
            </div>
            <TaskList tasks={status.recentTasks} />
          </div>

          {/* Right Column - Activity */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Activity</h2>
              <Link
                href="/activity"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                View all →
              </Link>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
              <ActivityTimeline events={status.recentEvents} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-zinc-500">
          <p>Aton Autonomous Agent Status Dashboard</p>
          <p className="text-xs mt-1">
            Data refreshes every 10 seconds •
            <a
              href="https://github.com/ATONCAP"
              target="_blank"
              rel="noopener"
              className="text-zinc-400 hover:text-white ml-1"
            >
              ATONCAP
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
