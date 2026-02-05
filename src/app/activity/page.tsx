"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import type { Event } from "@/lib/types";

export default function ActivityPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch("/api/activity?limit=100");
      const data = await res.json();
      setEvents(data.events);
      setTotal(data.total);
      setLoading(false);
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800 sticky top-0 bg-black/90 backdrop-blur-sm z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              <span className="text-blue-400">ATON</span>
              <span className="text-zinc-500">CRUX</span>
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-400">Activity</span>
          </div>
          <div className="text-sm text-zinc-500">{total} events</div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <ActivityTimeline events={events} />
          </div>
        )}
      </main>
    </div>
  );
}
