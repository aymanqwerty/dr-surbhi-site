import type { Gender, PatientRelationship } from "@/lib/patient-api";

export function relationshipLabel(value: PatientRelationship | null): string {
  if (!value) return "";
  const map: Record<PatientRelationship, string> = {
    SELF: "Myself",
    SPOUSE: "Spouse",
    FATHER: "Father",
    MOTHER: "Mother",
    SON: "Son",
    DAUGHTER: "Daughter",
    BROTHER: "Brother",
    SISTER: "Sister",
    GUARDIAN: "Guardian",
    OTHER: "Other",
  };
  return map[value];
}

export function genderLabel(value: Gender | null): string {
  if (!value) return "";
  const map: Record<Gender, string> = {
    MALE: "Male",
    FEMALE: "Female",
    OTHER: "Other",
    PREFER_NOT_TO_SAY: "Prefer not to say",
  };
  return map[value];
}

export function personMeta(age: number | null, gender: Gender | null): string {
  return [age != null ? `${age} yrs` : null, genderLabel(gender) || null]
    .filter(Boolean)
    .join(" · ");
}

export function formatLongDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function hhmm(time: string): string {
  return time.slice(0, 5);
}
