"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import TripGrid from "@/components/trips/TripGrid";
import TripForm from "@/components/trips/TripForm";
import type { Trip } from "@/types";

export default function DashboardPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [open, setOpen] = useState(false);

  function loadTrips() {
    fetch("/api/trips")
      .then((r) => r.json())
      .then(setTrips);
  }

  useEffect(() => {
    loadTrips();
  }, []);

  function handleClose() {
    setOpen(false);
    loadTrips();
  }

  return (
    <main className="bg-zinc-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">My Trips</h1>
            <p className="text-sm text-zinc-500 mt-0.5">Plan and manage your travel itineraries</p>
          </div>
          <Button onClick={() => setOpen(true)}>+ New Trip</Button>
        </div>

        <TripGrid trips={trips} onDelete={loadTrips} />

        <Modal open={open} onClose={handleClose} title="New Trip">
          <TripForm onClose={handleClose} />
        </Modal>
      </div>
    </main>
  );
}
