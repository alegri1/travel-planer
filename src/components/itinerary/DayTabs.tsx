import type { DayPlan } from "@/types";

interface DayTabsProps {
  days: DayPlan[];
  activeDay: number;
  onSelect: (dayIndex: number) => void;
}

export default function DayTabs({ days, activeDay, onSelect }: DayTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {days.map((day) => {
        const isActive = day.dayIndex === activeDay;
        return (
          <button
            key={day.dayIndex}
            onClick={() => onSelect(day.dayIndex)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
              isActive
                ? "bg-zinc-900 text-white"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            {day.label}
          </button>
        );
      })}
    </div>
  );
}
