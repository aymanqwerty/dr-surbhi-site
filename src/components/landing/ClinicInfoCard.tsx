import { Card } from "@/components/ui/Card";
import type { Doctor } from "@/lib/types";

const DAY_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

export function ClinicInfoCard({ doctor }: { doctor: Doctor }) {
  return (
    <Card>
      <h2 className="text-xl font-semibold text-sage-900">{doctor.clinic_name}</h2>
      {doctor.hospital && <p className="mt-1 text-sm text-sage-500">{doctor.hospital}</p>}
      <p className="mt-3 text-sm leading-relaxed text-sage-600">{doctor.clinic_address}</p>

      <h3 className="mt-6 text-sm font-medium text-sage-700">Availability</h3>
      <ul className="mt-2 space-y-1.5 text-sm">
        {DAY_ORDER.filter((day) => doctor.availability[day]).map((day) => (
          <li key={day} className="flex justify-between gap-4 text-sage-600">
            <span className="capitalize text-sage-400">{day}</span>
            <span className="text-right font-medium text-sage-800">{doctor.availability[day]}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
