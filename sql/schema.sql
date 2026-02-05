-- Atoncrux Database Schema
-- Synced from Aton Orchestrator

-- Tasks table - mirrors orchestrator tasks
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  source_ref TEXT,
  title TEXT NOT NULL,
  description TEXT,
  priority INTEGER DEFAULT 5,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_created ON tasks(created_at DESC);

-- Sessions table - Claude execution sessions
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES tasks(id),
  status TEXT DEFAULT 'running',
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  pid INTEGER,
  result TEXT,
  tokens_used INTEGER
);

CREATE INDEX IF NOT EXISTS idx_sessions_task ON sessions(task_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_started ON sessions(started_at DESC);

-- Events log - activity timeline
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  payload JSONB,
  source_agent TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp DESC);

-- Heartbeat - daemon status snapshots
CREATE TABLE IF NOT EXISTS heartbeat (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  daemon_pid INTEGER,
  daemon_version TEXT,
  channels JSONB,
  task_counts JSONB,
  active_session_id TEXT,
  active_task_title TEXT
);

CREATE INDEX IF NOT EXISTS idx_heartbeat_timestamp ON heartbeat(timestamp DESC);

-- Keep only last 1000 heartbeats
CREATE OR REPLACE FUNCTION cleanup_old_heartbeats()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM heartbeat WHERE id NOT IN (
    SELECT id FROM heartbeat ORDER BY timestamp DESC LIMIT 1000
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS heartbeat_cleanup ON heartbeat;
CREATE TRIGGER heartbeat_cleanup
  AFTER INSERT ON heartbeat
  FOR EACH STATEMENT
  EXECUTE FUNCTION cleanup_old_heartbeats();
