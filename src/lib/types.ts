export type TaskStatus = "pending" | "in_progress" | "completed" | "failed";

export interface Task {
  id: string;
  source: string;
  source_ref: string | null;
  title: string;
  description: string | null;
  priority: number;
  status: TaskStatus;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  metadata: Record<string, unknown> | null;
}

export type SessionStatus = "running" | "completed" | "failed";

export interface Session {
  id: string;
  task_id: string;
  status: SessionStatus;
  started_at: string;
  completed_at: string | null;
  pid: number | null;
  result: string | null;
  tokens_used: number | null;
}

export interface Event {
  id: number;
  event_type: string;
  payload: Record<string, unknown> | null;
  source_agent: string | null;
  timestamp: string;
}

export interface Heartbeat {
  id: number;
  timestamp: string;
  daemon_pid: number | null;
  daemon_version: string | null;
  channels: {
    telegram: boolean;
    imessage: boolean;
    signal: boolean;
  } | null;
  task_counts: {
    pending: number;
    in_progress: number;
    completed: number;
    failed: number;
  } | null;
  active_session_id: string | null;
  active_task_title: string | null;
}

export interface DashboardStatus {
  online: boolean;
  lastSeen: string | null;
  daemonPid: number | null;
  daemonVersion: string | null;
  channels: {
    telegram: boolean;
    imessage: boolean;
    signal: boolean;
  };
  taskCounts: {
    pending: number;
    in_progress: number;
    completed: number;
    failed: number;
  };
  activeTask: {
    id: string;
    title: string;
    sessionId: string;
  } | null;
  recentTasks: Task[];
  recentEvents: Event[];
}
