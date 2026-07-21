"use client";

import Link from "next/link";

import { usePublicDoctor } from "@/lib/hooks";
import type { PublicClinic } from "@/lib/patient-api";
import { Button } from "@/components/ui/Button";

function fullAddress(clinic: PublicClinic): string {
  return [clinic.address_line_1, clinic.address_line_2, clinic.city, clinic.state, clinic.country]
    .filter(Boolean)
    .join(", ");
}

export function ClinicsList() {
  const { data, isPending, isError } = usePublicDoctor();

  if (isPending) return <p className="text-sm text-sage-500">Loading clinics...</p>;
  if (isError) return <p className="text-sm text-red-600">Could not load clinics right now.</p>;

  const clinics = data?.clinics ?? [];

  if (clinics.length === 0) {
    return (
      <div className="rounded-3xl border border-brand-100 bg-white p-10 text-center shadow-card">
        <p className="text-sm text-sage-500">
          Clinic details will appear here soon. You can still book online to see available dates and
          times.
        </p>
        <Link href="/book" className="mt-4 inline-block">
          <Button>Book Appointment</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {clinics.map((clinic) => (
        <div key={clinic.id} className="flex flex-col justify-between rounded-3xl border border-brand-100 bg-white p-8 shadow-card">
          <div>
            <h2 className="text-lg font-bold text-sage-900">{clinic.clinic_name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-sage-600">{fullAddress(clinic)}</p>
            {clinic.phone_number && (
              <p className="mt-2 text-sm text-sage-500">📞 {clinic.phone_number}</p>
            )}
            {clinic.consultation_fee && (
              <p className="mt-1 text-sm text-sage-500">
                Consultation fee: ₹{clinic.consultation_fee}
              </p>
            )}
            {clinic.google_maps_url && (
              <a
                href={clinic.google_maps_url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-medium text-brand-600 hover:underline"
              >
                View on map →
              </a>
            )}
          </div>
          <Link href="/book" className="mt-6 inline-block">
            <Button>Book here</Button>
          </Link>
        </div>
      ))}
    </div>
  );
}
