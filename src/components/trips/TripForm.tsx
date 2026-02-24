"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

interface TripFormProps {
  onClose: () => void;
}

export default function TripForm({ onClose }: TripFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      destination: (form.elements.namedItem("destination") as HTMLInputElement).value.trim(),
      start_date: (form.elements.namedItem("start_date") as HTMLInputElement).value,
      end_date: (form.elements.namedItem("end_date") as HTMLInputElement).value,
    };

    if (data.end_date < data.start_date) {
      setError("End date must be on or after start date.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      setError("Failed to create trip.");
      setLoading(false);
      return;
    }

    router.refresh();
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-zinc-600" htmlFor="name">
          Trip name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Summer Vacation"
          className="rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-zinc-600" htmlFor="destination">
          Destination
        </label>
        <input
          id="destination"
          name="destination"
          type="text"
          required
          placeholder="Tokyo, Japan"
          className="rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-600" htmlFor="start_date">
            Start date
          </label>
          <input
            id="start_date"
            name="start_date"
            type="date"
            required
            className="rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-600" htmlFor="end_date">
            End date
          </label>
          <input
            id="end_date"
            name="end_date"
            type="date"
            required
            className="rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition"
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="ghost" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating…" : "Create trip"}
        </Button>
      </div>
    </form>
  );
}
