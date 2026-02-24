"use client";

import Card from "@/components/ui/Card";
import ActivityItem from "./ActivityItem";
import ActivityForm from "./ActivityForm";
import type { DayPlan } from "@/types";

interface DayColumnProps {
  day: DayPlan;
  tripId: number;
  onRefresh: () => void;
}

export default function DayColumn({ day, tripId, onRefresh }: DayColumnProps) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="mb-1">
        <h2 className="text-sm font-semibold text-zinc-900">{day.label}</h2>
        <p className="text-xs text-zinc-400">{day.date}</p>
      </div>

      {day.activities.length === 0 ? (
        <p className="text-xs text-zinc-400 py-4 text-center">No activities yet</p>
      ) : (
        <div>
          {day.activities.map((activity) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              tripId={tripId}
              onDelete={onRefresh}
            />
          ))}
        </div>
      )}

      <ActivityForm tripId={tripId} dayIndex={day.dayIndex} onAdded={onRefresh} />
    </Card>
  );
}
