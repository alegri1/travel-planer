"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { Activity } from "@/types";

interface ActivityItemProps {
  activity: Activity;
  tripId: number;
  onDelete: () => void;
}

export default function ActivityItem({ activity, tripId, onDelete }: ActivityItemProps) {
  async function handleDelete() {
    if (!confirm(`Delete "${activity.title}"?`)) return;
    await fetch(`/api/trips/${tripId}/activities/${activity.id}`, { method: "DELETE" });
    onDelete();
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
