"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ActivityItem from "./ActivityItem";
import ActivityForm from "./ActivityForm";
import FlightSearch from "./FlightSearch";
import type { DayPlan } from "@/types";

interface DayColumnProps {
  day: DayPlan;
  tripId: number;
  onRefresh: () => void;
}

export default function DayColumn({ day, tripId, onRefresh }: DayColumnProps) {
  const [flightSearchOpen, setFlightSearchOpen] = useState(false);

  return (
    <>
      <Card className="flex flex-col gap-2">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">{day.label}</h2>
            <p className="text-xs text-zinc-400">{day.date}</p>
          </div>
          <Button
            variant="ghost"
            className="text-xs px-2 py-1"
            onClick={() => setFlightSearchOpen(true)}
          >
            ✈ Flights
          </Button>
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

      <FlightSearch
        open={flightSearchOpen}
        onClose={() => setFlightSearchOpen(false)}
        tripId={tripId}
        dayIndex={day.dayIndex}
        defaultDate={day.date}
        onAdded={onRefresh}
      />
    </>
  );
}
