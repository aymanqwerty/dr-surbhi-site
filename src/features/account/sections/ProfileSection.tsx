"use client";

import { useState } from "react";

import { SectionCard, Field } from "@/features/account/SectionCard";
import { usePatientSession, useUpsertProfile } from "@/lib/hooks";
import { personMeta } from "@/lib/labels";
import type { Gender, PatientProfile } from "@/lib/patient-api";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";

export function ProfileSection() {
  const { data: session } = usePatientSession();
  const [editing, setEditing] = useState(false);
  const profile = session?.profile ?? null;
  const phone = session?.account.phone_number ?? "";

  return (
    <SectionCard
      title="Profile"
      description="Your personal details, used to pre-fill your bookings."
      action={
        <Button onClick={() => setEditing(true)}>{profile ? "Edit" : "Complete"}</Button>
      }
    >
      {profile ? (
        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <Field label="Name" value={profile.full_name} />
          <Field label="Mobile" value={phone} />
          <Field label="Age / Gender" value={personMeta(profile.age, profile.gender) || "—"} />
          <Field label="Date of birth" value={profile.date_of_birth || "—"} />
          <Field label="Email" value={profile.email || "—"} />
        </dl>
      ) : (
        <p className="text-sm text-sage-500">
          Add your details so we can pre-fill your bookings.
        </p>
      )}
      <ProfileModal profile={profile} open={editing} onClose={() => setEditing(false)} />
    </SectionCard>
  );
}

function ProfileModal({
  profile,
  open,
  onClose,
}: {
  profile: PatientProfile | null;
  open: boolean;
  onClose: () => void;
}) {
  const mutation = useUpsertProfile();
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? "",
    gender: profile?.gender ?? "",
    date_of_birth: profile?.date_of_birth ?? "",
    email: profile?.email ?? "",
  });
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim()) {
      setError("Please enter your name.");
      return;
    }
    mutation.mutate(
      {
        full_name: form.full_name.trim(),
        gender: (form.gender || null) as Gender | null,
        date_of_birth: form.date_of_birth || null,
        email: form.email || null,
      },
      { onSuccess: onClose },
    );
  };

  const serverError = mutation.error instanceof ApiError ? mutation.error.message : null;

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="text-lg font-bold text-sage-900">Edit profile</h3>
      <form className="mt-5 flex flex-col gap-4" onSubmit={submit}>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-sage-700">Full name</span>
          <Input
            value={form.full_name}
            onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-sage-700">Gender</span>
            <Select
              value={form.gender}
              onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
            >
              <option value="">Prefer not to say</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-sage-700">Date of birth</span>
            <Input
              type="date"
              value={form.date_of_birth}
              onChange={(e) => setForm((f) => ({ ...f, date_of_birth: e.target.value }))}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-sage-700">Email (optional)</span>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </div>
        {(error || serverError) && (
          <p className="text-sm text-red-600">{error ?? serverError}</p>
        )}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
