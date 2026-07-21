"use client";

import { useEffect, useState } from "react";

import { ApiError } from "@/lib/api";
import { useAddMember, useUpdateMember } from "@/lib/hooks";
import { relationshipLabel } from "@/lib/labels";
import {
  MEMBER_RELATIONSHIPS,
  type Gender,
  type MemberPayload,
  type PatientProfile,
  type PatientRelationship,
} from "@/lib/patient-api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";

interface Props {
  member?: PatientProfile;
  open: boolean;
  onClose: () => void;
  onSaved?: (member: PatientProfile) => void;
}

const EMPTY = {
  full_name: "",
  relationship: "OTHER" as PatientRelationship,
  phone_number: "",
  gender: "",
  date_of_birth: "",
  email: "",
};

export function MemberFormModal({ member, open, onClose, onSaved }: Props) {
  const isEdit = Boolean(member);
  const addMutation = useAddMember();
  const updateMutation = useUpdateMember(member?.id ?? "");
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setForm(
      member
        ? {
            full_name: member.full_name,
            relationship: (member.relationship ?? "OTHER") as PatientRelationship,
            phone_number: member.phone_number ?? "",
            gender: member.gender ?? "",
            date_of_birth: member.date_of_birth ?? "",
            email: member.email ?? "",
          }
        : EMPTY,
    );
  }, [open, member]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim()) {
      setError("Please enter a name.");
      return;
    }
    const payload: MemberPayload = {
      full_name: form.full_name.trim(),
      relationship: form.relationship,
      phone_number: form.phone_number.trim() || null,
      gender: (form.gender || null) as Gender | null,
      date_of_birth: form.date_of_birth || null,
      email: form.email || null,
    };
    const onSuccess = (saved: PatientProfile) => {
      onClose();
      onSaved?.(saved);
    };
    if (member) updateMutation.mutate(payload, { onSuccess });
    else addMutation.mutate(payload, { onSuccess });
  };

  const pending = addMutation.isPending || updateMutation.isPending;
  const serverError =
    (addMutation.error ?? updateMutation.error) instanceof ApiError
      ? (addMutation.error ?? updateMutation.error as ApiError).message
      : null;

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="text-lg font-bold text-sage-900">
        {isEdit ? "Edit family member" : "Add family member"}
      </h3>
      <p className="mt-1 text-sm text-sage-500">
        Saved people can be selected when booking, so you don&apos;t retype their details.
      </p>
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
            <span className="text-xs font-semibold text-sage-700">Relationship</span>
            <Select
              value={form.relationship}
              onChange={(e) =>
                setForm((f) => ({ ...f, relationship: e.target.value as PatientRelationship }))
              }
            >
              {MEMBER_RELATIONSHIPS.map((rel) => (
                <option key={rel} value={rel}>
                  {relationshipLabel(rel)}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-sage-700">Gender</span>
            <Select
              value={form.gender}
              onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
            >
              <option value="">Not specified</option>
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
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-sage-700">Phone (optional)</span>
            <Input
              type="tel"
              value={form.phone_number}
              onChange={(e) => setForm((f) => ({ ...f, phone_number: e.target.value }))}
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
          <p className="text-sm text-red-600" role="alert">
            {error ?? serverError}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
