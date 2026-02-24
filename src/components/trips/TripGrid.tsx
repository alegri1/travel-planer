import TripCard from "./TripCard";
import type { Trip } from "@/types";

interface TripGridProps {
  trips: Trip[];
  onDelete?: () => void;
}

export default function TripGrid({ trips, onDelete }: TripGridProps) {
  if (trips.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-400">
        <p className="text-lg">No trips yet.</p>
        <p className="text-sm mt-1">Create your first trip to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} onDelete={onDelete} />
      ))}
    </div>
  );
}
