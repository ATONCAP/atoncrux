"use client";

interface StatusIndicatorProps {
  online: boolean;
  lastSeen: string | null;
}

export function StatusIndicator({ online, lastSeen }: StatusIndicatorProps) {
  const formatLastSeen = (timestamp: string | null) => {
    if (!timestamp) return "Never";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div
          className={`w-4 h-4 rounded-full ${
            online ? "bg-green-500" : "bg-red-500"
          }`}
        />
        {online && (
          <div className="absolute inset-0 w-4 h-4 rounded-full bg-green-500 animate-ping opacity-75" />
        )}
      </div>
      <div>
        <div className={`font-semibold ${online ? "text-green-400" : "text-red-400"}`}>
          {online ? "ONLINE" : "OFFLINE"}
        </div>
        <div className="text-xs text-zinc-500">
          Last seen: {formatLastSeen(lastSeen)}
        </div>
      </div>
    </div>
  );
}
