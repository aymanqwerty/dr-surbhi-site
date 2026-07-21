"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import {
  BookingWizard,
  type SessionPrefill,
} from "@/features/booking/BookingWizard";
import { getBookingSession } from "@/lib/patient-api";
import { Spinner } from "@/components/ui/Spinner";

export function BookingEntry() {
  const params = useSearchParams();
  const token = params.get("session");

  const { data, isPending, isError } = useQuery({
    queryKey: ["booking-session", token],
    queryFn: () => getBookingSession(token as string),
    enabled: Boolean(token),
    retry: false,
  });

  if (!token) return <BookingWizard />;

  if (isPending) {
    return (
      <p className="flex items-center gap-2 text-sm text-sage-500">
        <Spinner /> Loading your appointment details...
      </p>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-3xl border border-brand-100 bg-white p-8 text-center text-sm text-sage-500 shadow-card">
        This booking link is invalid or has expired. You can still book normally below.
        <div className="mt-6">
          <BookingWizard />
        </div>
      </div>
    );
  }

  const prefill: SessionPrefill = {
    clinicId: data.clinic_id ?? "",
    date: data.slot_date ?? "",
    slotId: data.slot_id ?? "",
    name: data.name,
    phone: data.phone_number,
    email: data.email ?? "",
    age: data.age != null ? String(data.age) : "",
    gender: data.gender ?? "",
    reason: data.reason ?? "",
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-brand-100 bg-brand-50/60 px-4 py-3 text-sm text-brand-700">
        We&apos;ve pre-filled the details from your call. Review them and confirm your appointment.
      </div>
      <BookingWizard prefill={prefill} />
    </div>
  );
}
