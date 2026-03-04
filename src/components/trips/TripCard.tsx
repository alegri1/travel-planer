import { Link } from "react-router";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { Trip } from "@/types";

interface TripCardProps {
  trip: Trip;
  onDelete?: () => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TripCard({ trip, onDelete }: TripCardProps) {
  async function handleDelete() {
    if (!confirm(`Delete "${trip.name}"?`)) return;
    await fetch(`/api/trips/${trip.id}`, { method: "DELETE" });
    onDelete?.();
  }

  return (
    <Card className="flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <Link
          to={`/trips/${trip.id}`}
          className="text-base font-semibold text-zinc-900 hover:text-zinc-600 transition-colors leading-snug"
        >
          {trip.name}
        </Link>
        <Button variant="danger" className="shrink-0 px-2 py-1 text-xs" onClick={handleDelete}>
          Delete
        </Button>
      </div>
      <p className="text-sm text-zinc-500">{trip.destination}</p>
      <div className="flex gap-2 flex-wrap mt-auto pt-1">
        <Badge>{formatDate(trip.start_date)}</Badge>
        <span className="text-zinc-300 text-xs self-center">→</span>
        <Badge>{formatDate(trip.end_date)}</Badge>
      </div>
    </Card>
  );
}
