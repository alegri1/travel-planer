"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { Activity, FlightMetadata } from "@/types";

interface ActivityItemProps {
  activity: Activity;
  tripId: number;
  onDelete: () => void;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function FlightCard({ meta, onDelete }: { meta: FlightMetadata; onDelete: () => void }) {
  const stopLabel =
    meta.stops === 0 ? "Nonstop" : `${meta.stops} stop${meta.stops > 1 ? "s" : ""}`;

  return (
    <div className="flex items-start gap-3 py-2 border-b border-zinc-100 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm">✈</span>
          <span className="text-sm font-semibold text-zinc-900">{meta.flightNumber}</span>
          <span className="text-sm text-zinc-700">
            {formatTime(meta.departure)} → {formatTime(meta.arrival)}
          </span>
          <Badge>{stopLabel}</Badge>
          <Badge className="bg-blue-50 text-blue-700">{meta.cabin}</Badge>
        </div>
        <div className="text-xs text-zinc-500 mt-0.5">
          {meta.origin} → {meta.destination} · {meta.duration} · ${meta.price} {meta.currency}
        </div>
      </div>
      <Button variant="danger" className="px-2 py-1 text-xs shrink-0" onClick={onDelete}>
        ✕
      </Button>
    </div>
  );
}

export default function ActivityItem({ activity, tripId, onDelete }: ActivityItemProps) {
  async function handleDelete() {
    if (!confirm(`Delete "${activity.title}"?`)) return;
    await fetch(`/api/trips/${tripId}/activities/${activity.id}`, { method: "DELETE" });
    onDelete();
  }

  if (activity.metadata) {
    try {
      const meta = JSON.parse(activity.metadata) as FlightMetadata;
      if (meta.type === "flight") {
        return <FlightCard meta={meta} onDelete={handleDelete} />;
      }
    } catch {
      // fall through to default render
    }
  }

  return (
    <div className="flex items-start gap-3 py-2 border-b border-zinc-100 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-900 truncate">{activity.title}</span>
          {activity.time && <Badge>{activity.time}</Badge>}
        </div>
        {activity.notes && (
          <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{activity.notes}</p>
        )}
      </div>
      <Button
        variant="danger"
        className="px-2 py-1 text-xs shrink-0"
        onClick={handleDelete}
      >
        ✕
      </Button>
    </div>
  );
}
