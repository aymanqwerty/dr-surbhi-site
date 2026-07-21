import { Card } from "@/components/ui/Card";
import type { Doctor } from "@/lib/types";

interface DoctorInfoCardProps {
  doctor: Doctor;
  bio: string;
}

export function DoctorInfoCard({ doctor, bio }: DoctorInfoCardProps) {
  return (
    <Card>
      <h2 className="text-xl font-semibold text-sage-900">{doctor.name}</h2>
      <p className="mt-1 text-sm font-medium text-brand-600">{doctor.qualification}</p>
      <p className="mt-4 text-sm leading-relaxed text-sage-600">{bio}</p>

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-sage-400">Experience</dt>
          <dd className="font-medium text-sage-800">{doctor.experience_years} years</dd>
        </div>
        <div>
          <dt className="text-sage-400">Languages</dt>
          <dd className="font-medium text-sage-800">{doctor.languages.join(", ")}</dd>
        </div>
        <div>
          <dt className="text-sage-400">Consultation Fee</dt>
          <dd className="font-medium text-sage-800">₹{doctor.consultation_fee}</dd>
        </div>
      </dl>
    </Card>
  );
}
