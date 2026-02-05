"use client";

interface ChannelsStatusProps {
  channels: {
    telegram: boolean;
    imessage: boolean;
    signal: boolean;
  };
}

export function ChannelsStatus({ channels }: ChannelsStatusProps) {
  const channelConfig = [
    { key: "telegram", label: "Telegram", icon: "📱" },
    { key: "imessage", label: "iMessage", icon: "💬" },
    { key: "signal", label: "Signal", icon: "🔐" },
  ] as const;

  return (
    <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
      <h3 className="text-sm font-medium text-zinc-400 mb-3">Communication Channels</h3>
      <div className="space-y-2">
        {channelConfig.map(({ key, label, icon }) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>{icon}</span>
              <span className="text-sm">{label}</span>
            </div>
            <div
              className={`w-2 h-2 rounded-full ${
                channels[key] ? "bg-green-500" : "bg-zinc-600"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
