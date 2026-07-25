"use client";

import { SectionCard } from "@/features/account/SectionCard";
import { downloadAppointmentReceipt } from "@/features/account/lib/receipt";
import { useMyAppointments } from "@/lib/hooks";
import { formatLongDate, hhmm } from "@/lib/labels";
import { Button } from "@/components/ui/Button";

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  COMPLETED: "bg-sage-100 text-sage-700 border-sage-300",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  NO_SHOW: "bg-cream-100 text-sage-500 border-sage-200",
};

export function AppointmentsSection() {
  const { data: appointments, isPending } = useMyAppointments();

  return (
    <SectionCard
      title="My Appointments"
      description="Your visits with Dr. Surbhi. Download a receipt for any appointment."
    >
      {isPending ? (
        <p className="text-sm text-sage-500">Loading...</p>
      ) : !appointments || appointments.length === 0 ? (
        <p className="text-sm text-sage-500">You have no appointments yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {appointments.map((a) => (
            <li key={a.id} className="rounded-2xl border border-sage-200/60 bg-cream-50/40 p-4 transition-colors hover:border-sage-300/70">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-sage-800">{a.patient_name}</span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                        STATUS_STYLES[a.appointment_status] ??
                        "bg-cream-100 text-sage-500 border-sage-200"
                      }`}
                    >
                      {a.appointment_status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-sage-400">
                    {a.clinic_name} · Token {a.token_number} · {a.appointment_number}
                  </p>
                  <p className="mt-1 text-sm text-sage-600">
                    {formatLongDate(a.appointment_date)} · {hhmm(a.start_time)} – {hhmm(a.end_time)}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  className="shrink-0 self-start"
                  onClick={() => downloadAppointmentReceipt(a)}
                >
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
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                  Receipt
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
