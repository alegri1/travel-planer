import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import type { FlightOffer } from "@/lib/amadeus";

interface FlightSearchProps {
  open: boolean;
  onClose: () => void;
  tripId: number;
  dayIndex: number;
  defaultDate: string;
  onAdded: () => void;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function FlightSearch({
  open,
  onClose,
  tripId,
  dayIndex,
  defaultDate,
  onAdded,
}: FlightSearchProps) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [adults, setAdults] = useState(1);
  const [results, setResults] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);

    const res = await fetch("/api/flights/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ origin, destination, date, adults }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Search failed");
      return;
    }

    if (data.length === 0) {
      setError("No flights found for this route and date.");
      return;
    }

    setResults(data);
  }

  async function handleAdd(flight: FlightOffer) {
    setAdding(flight.id);

    const title = `✈ ${flight.flightNumber}: ${flight.origin} → ${flight.destination}`;
    const time = formatTime(flight.departure);
    const stopLabel = flight.stops === 0 ? "Nonstop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`;
    const notes = `${flight.cabin} · ${stopLabel} · ${flight.duration} · $${flight.price} ${flight.currency}`;
    const metadata = JSON.stringify({
      type: "flight",
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      origin: flight.origin,
      destination: flight.destination,
      departure: flight.departure,
      arrival: flight.arrival,
      duration: flight.duration,
      price: flight.price,
      currency: flight.currency,
      cabin: flight.cabin,
      stops: flight.stops,
    });

    await fetch(`/api/trips/${tripId}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day_index: dayIndex, title, time, notes, metadata }),
    });

    setAdding(null);
    onAdded();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Search Flights" size="lg">
      <form onSubmit={handleSearch} className="flex flex-wrap gap-2 mb-4">
        <input
          className="text-zinc-900 border border-zinc-200 rounded-xl px-3 py-2 text-sm flex-1 min-w-[80px] focus:outline-none focus:ring-2 focus:ring-zinc-300"
          placeholder="From (IATA)"
          value={origin}
          onChange={(e) => setOrigin(e.target.value.toUpperCase())}
          maxLength={3}
          required
        />
        <input
          className="text-zinc-900 border border-zinc-200 rounded-xl px-3 py-2 text-sm flex-1 min-w-[80px] focus:outline-none focus:ring-2 focus:ring-zinc-300"
          placeholder="To (IATA)"
          value={destination}
          onChange={(e) => setDestination(e.target.value.toUpperCase())}
          maxLength={3}
          required
        />
        <input
          type="date"
          className="text-zinc-900 border border-zinc-200 rounded-xl px-3 py-2 text-sm flex-1 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-zinc-300"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="number"
          className="text-zinc-900 border border-zinc-200 rounded-xl px-3 py-2 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-zinc-300"
          placeholder="Pax"
          min={1}
          max={9}
          value={adults}
          onChange={(e) => setAdults(Number(e.target.value))}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </Button>
      </form>

      {error && (
        <p className="text-sm text-red-500 mb-3">{error}</p>
      )}

      {results.length > 0 && (
        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
          {results.map((flight) => {
            const stopLabel =
              flight.stops === 0
                ? "Nonstop"
                : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`;
            return (
              <div
                key={flight.id}
                className="flex items-center gap-3 border border-zinc-100 rounded-xl px-4 py-3 hover:bg-zinc-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-zinc-900">
                      {flight.flightNumber}
                    </span>
                    <span className="text-sm text-zinc-700">
                      {formatTime(flight.departure)} → {formatTime(flight.arrival)}
                    </span>
                    <Badge>{stopLabel}</Badge>
                    <Badge className="bg-blue-50 text-blue-700">{flight.cabin}</Badge>
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    {flight.origin} → {flight.destination} · {flight.duration}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold text-zinc-900">
                    ${flight.price}
                  </div>
                  <Button
                    variant="ghost"
                    className="text-xs px-2 py-1 mt-1"
                    disabled={adding === flight.id}
                    onClick={() => handleAdd(flight)}
                  >
                    {adding === flight.id ? "Adding…" : "+ Add"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
