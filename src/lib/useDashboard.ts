"use client";

import { useState, useEffect, useCallback } from "react";
import type { DashboardStatus } from "./types";

const POLL_INTERVAL = 10000; // 10 seconds

export function useDashboard() {
  const [status, setStatus] = useState<DashboardStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    const res = await fetch("/api/status", { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return res.json() as Promise<DashboardStatus>;
  }, []);

  const refresh = useCallback(async () => {
    setError(null);
    const data = await fetchStatus();
    setStatus(data);
    setLoading(false);
  }, [fetchStatus]);

  useEffect(() => {
    refresh().catch((err) => {
      setError(err.message);
      setLoading(false);
    });

    const interval = setInterval(() => {
      refresh().catch((err) => {
        setError(err.message);
      });
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [refresh]);

  return { status, loading, error, refresh };
}
