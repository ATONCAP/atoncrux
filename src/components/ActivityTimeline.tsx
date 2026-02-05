"use client";

import type { Event } from "@/lib/types";

interface ActivityTimelineProps {
  events: Event[];
}

const eventConfig: Record<string, { icon: string; color: string }> = {
  "task.created": { icon: "📋", color: "text-blue-400" },
  "task.started": { icon: "▶️", color: "text-yellow-400" },
  "task.completed": { icon: "✅", color: "text-green-400" },
  "task.failed": { icon: "❌", color: "text-red-400" },
  "session.started": { icon: "🚀", color: "text-purple-400" },
  "session.completed": { icon: "🏁", color: "text-green-400" },
  "message.received": { icon: "💬", color: "text-cyan-400" },
  "message.sent": { icon: "📤", color: "text-cyan-400" },
  default: { icon: "📌", color: "text-zinc-400" },
};

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString();
}

function getEventDescription(event: Event): string {
  const payload = event.payload;
  if (!payload) return event.event_type;

  if ("title" in payload && typeof payload.title === "string") {
    return payload.title;
  }
  if ("taskId" in payload && typeof payload.taskId === "string") {
    return `Task ${payload.taskId.slice(0, 8)}...`;
  }
  if ("message" in payload && typeof payload.message === "string") {
    return payload.message.slice(0, 50) + (payload.message.length > 50 ? "..." : "");
  }

  return event.event_type.replace(/\./g, " ").replace(/_/g, " ");
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500">
        No recent activity
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {events.map((event) => {
        const config = eventConfig[event.event_type] ?? eventConfig.default;
        return (
          <div
            key={event.id}
            className="flex items-start gap-3 py-2 border-b border-zinc-800 last:border-0"
          >
            <span className="text-lg">{config.icon}</span>
            <div className="flex-1 min-w-0">
              <div className={`text-sm ${config.color}`}>
                {event.event_type}
              </div>
              <div className="text-xs text-zinc-400 truncate">
                {getEventDescription(event)}
              </div>
            </div>
            <div className="text-xs text-zinc-500 shrink-0">
              {formatTime(event.timestamp)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
