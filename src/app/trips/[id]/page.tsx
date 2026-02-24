"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DayTabs from "@/components/itinerary/DayTabs";
import DayColumn from "@/components/itinerary/DayColumn";
import Button from "@/components/ui/Button";
import type { Trip, Activity, DayPlan } from "@/types";

function buildDayPlans(trip: Trip, activities: Activity[]): DayPlan[] {
  const start = new Date(trip.start_date + "T00:00:00");
  const end = new Date(trip.end_date + "T00:00:00");
  const days: DayPlan[] = [];

  let current = new Date(start);
  let dayIndex = 0;

  while (current <= end) {
    const dateStr = current.toISOString().slice(0, 10);
    const label = current.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    const dayActivities = activities
      .filter((a) => a.day_index === dayIndex)
      .sort((a, b) => a.position - b.position);

    days.push({ dayIndex, date: dateStr, label, activities: dayActivities });

    current.setDate(current.getDate() + 1);
    dayIndex++;
  }

  return days;
}

export default function ItineraryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeDay, setActiveDay] = useState(0);
  const [notFound, setNotFound] = useState(false);

  const loadData = useCallback(async () => {
    const [tripRes, actRes] = await Promise.all([
      fetch(`/api/trips/${id}`),
      fetch(`/api/trips/${id}/activities`),
    ]);

    if (tripRes.status === 404) {
      setNotFound(true);
      return;
    }

    const [tripData, actData] = await Promise.all([tripRes.json(), actRes.json()]);
    setTrip(tripData);
    setActivities(actData);
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (notFound) {
    return (
      <main className="bg-zinc-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Trip not found.</p>
          <Link href="/" className="text-sm text-zinc-900 underline">
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (!trip) {
    return (
      <main className="bg-zinc-50 min-h-screen flex items-center justify-center">
        <p className="text-zinc-400 text-sm">Loading…</p>
      </main>
    );
  }

  const days = buildDayPlans(trip, activities);
  const activeDay_ = days.find((d) => d.dayIndex === activeDay) ?? days[0];

  return (
    <main className="bg-zinc-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-6">
          <Button variant="ghost" className="mb-4 px-0 text-xs" onClick={() => router.push("/")}>
            ← Back to trips
          </Button>
          <h1 className="text-2xl font-bold text-zinc-900">{trip.name}</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{trip.destination}</p>
        </div>

        {days.length > 0 ? (
          <>
            <DayTabs days={days} activeDay={activeDay} onSelect={setActiveDay} />
            <div className="mt-6">
              {activeDay_ && (
                <DayColumn day={activeDay_} tripId={trip.id} onRefresh={loadData} />
              )}
            </div>
          </>
        ) : (
          <p className="text-zinc-400 text-sm">No days in this trip's date range.</p>
        )}
      </div>
    </main>
  );
}
