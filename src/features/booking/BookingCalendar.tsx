"use client";

import { Spinner } from "@/components/ui/Spinner";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function isoOf(year: number, month: number, day: number): string {
  return `${year}-${pad2(month + 1)}-${pad2(day)}`;
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={dir === "left" ? "M15.75 19.5L8.25 12l7.5-7.5" : "M8.25 4.5l7.5 7.5-7.5 7.5"}
      />
    </svg>
  );
}

export function BookingCalendar({
  year,
  month,
  todayIso,
  selected,
  availableDates,
  onSelect,
  onPrev,
  onNext,
  canPrev,
  canNext,
  loading,
}: {
  year: number;
  month: number;
  todayIso: string;
  selected: string;
  availableDates: Set<string>;
  onSelect: (iso: string) => void;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  loading: boolean;
}) {
  const monthName = new Date(year, month, 1).toLocaleDateString("en-US", { month: "long" });
  const startPad = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="rounded-2xl border border-brand-100 p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev}
          aria-label="Previous month"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sage-600 transition-colors hover:bg-sage-100 disabled:pointer-events-none disabled:opacity-30"
        >
          <Chevron dir="left" />
        </button>
        <span className="text-sm font-semibold text-sage-800">
          {monthName} {year}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          aria-label="Next month"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sage-600 transition-colors hover:bg-sage-100 disabled:pointer-events-none disabled:opacity-30"
        >
          <Chevron dir="right" />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1 text-center text-xs text-sage-400">
        {WEEKDAYS.map((w) => (
          <span key={w} className="py-1">
            {w}
          </span>
        ))}
      </div>

      <div className="relative">
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, index) => {
            if (day === null) return <span key={`pad-${index}`} />;
            const iso = isoOf(year, month, day);
            const isSelected = iso === selected;
            const enabled = iso >= todayIso && availableDates.has(iso);
            return (
              <button
                key={iso}
                type="button"
                disabled={!enabled}
                onClick={() => onSelect(iso)}
                className={`flex aspect-square items-center justify-center rounded-lg text-sm transition-colors ${
                  isSelected
                    ? "bg-brand-500 font-semibold text-white"
                    : enabled
                      ? "font-medium text-sage-800 hover:bg-sage-100"
                      : "cursor-default text-sage-300"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/60">
            <Spinner className="h-5 w-5 text-brand-500" />
          </div>
        )}
      </div>
    </div>
  );
}
