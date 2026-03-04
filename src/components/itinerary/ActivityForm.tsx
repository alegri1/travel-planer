import { useState } from "react";
import Button from "@/components/ui/Button";

interface ActivityFormProps {
  tripId: number;
  dayIndex: number;
  onAdded: () => void;
}

export default function ActivityForm({ tripId, dayIndex, onAdded }: ActivityFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      day_index: dayIndex,
      title: (form.elements.namedItem("title") as HTMLInputElement).value.trim(),
      time: (form.elements.namedItem("time") as HTMLInputElement).value || null,
      notes: (form.elements.namedItem("notes") as HTMLTextAreaElement).value.trim() || null,
    };

    const res = await fetch(`/api/trips/${tripId}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      setError("Failed to add activity.");
      setLoading(false);
      return;
    }

    form.reset();
    setOpen(false);
    setLoading(false);
    onAdded();
  }

  if (!open) {
    return (
      <Button variant="ghost" className="w-full justify-center border border-dashed border-zinc-200 mt-2" onClick={() => setOpen(true)}>
        + Add activity
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-2 flex flex-col gap-3 bg-zinc-50 rounded-xl p-3 border border-zinc-200"
    >
      <input
        name="title"
        type="text"
        required
        placeholder="Activity name"
        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition bg-white"
      />
      <input
        name="time"
        type="time"
        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition bg-white"
      />
      <textarea
        name="notes"
        placeholder="Notes (optional)"
        rows={2}
        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition bg-white resize-none"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" type="button" onClick={() => { setOpen(false); setError(""); }}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Adding…" : "Add"}
        </Button>
      </div>
    </form>
  );
}
