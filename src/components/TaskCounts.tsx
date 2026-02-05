"use client";

interface TaskCountsProps {
  counts: {
    pending: number;
    in_progress: number;
    completed: number;
    failed: number;
  };
}

export function TaskCounts({ counts }: TaskCountsProps) {
  const total = counts.pending + counts.in_progress + counts.completed + counts.failed;

  const stats = [
    { label: "Pending", value: counts.pending, color: "text-yellow-400", bg: "bg-yellow-400" },
    { label: "In Progress", value: counts.in_progress, color: "text-blue-400", bg: "bg-blue-400" },
    { label: "Completed", value: counts.completed, color: "text-green-400", bg: "bg-green-400" },
    { label: "Failed", value: counts.failed, color: "text-red-400", bg: "bg-red-400" },
  ];

  return (
    <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
      <h3 className="text-sm font-medium text-zinc-400 mb-3">Task Queue</h3>

      {/* Progress bar */}
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-4 flex">
        {total > 0 &&
          stats.map(({ label, value, bg }) =>
            value > 0 ? (
              <div
                key={label}
                className={`${bg} transition-all duration-500`}
                style={{ width: `${(value / total) * 100}%` }}
              />
            ) : null
          )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="text-center">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-zinc-500">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
