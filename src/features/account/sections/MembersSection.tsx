"use client";

import { useState } from "react";

import { SectionCard } from "@/features/account/SectionCard";
import { MemberFormModal } from "@/features/account/MemberFormModal";
import { useDeleteMember, useMyMembers } from "@/lib/hooks";
import { personMeta, relationshipLabel } from "@/lib/labels";
import type { PatientProfile } from "@/lib/patient-api";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";

export function MembersSection() {
  const { data: members, isPending } = useMyMembers();
  const deleteMutation = useDeleteMember();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PatientProfile | undefined>(undefined);

  const remove = (member: PatientProfile) => {
    if (window.confirm(`Remove ${member.full_name} from your family members?`)) {
      deleteMutation.mutate(member.id, {
        onError: (err) =>
          window.alert(err instanceof ApiError ? err.message : "Could not remove."),
      });
    }
  };

  return (
    <SectionCard
      title="Family Members"
      description="Save the people you book for, so you don't retype their details."
      action={
        <Button
          onClick={() => {
            setEditing(undefined);
            setOpen(true);
          }}
        >
          + Add
        </Button>
      }
    >
      {isPending ? (
        <p className="text-sm text-sage-500">Loading...</p>
      ) : !members || members.length === 0 ? (
        <p className="text-sm text-sage-500">
          No family members yet. Add one to book on their behalf.
        </p>
      ) : (
        <ul className="divide-y divide-sage-200/60">
          {members.map((member) => (
            <li key={member.id} className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-sage-800">{member.full_name}</p>
                  <p className="text-xs text-sage-400">
                    {[relationshipLabel(member.relationship), personMeta(member.age, member.gender)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="text-xs font-medium text-sage-500 hover:text-sage-800"
                  onClick={() => {
                    setEditing(member);
                    setOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
                  onClick={() => remove(member)}
                  disabled={deleteMutation.isPending}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <MemberFormModal member={editing} open={open} onClose={() => setOpen(false)} />
    </SectionCard>
  );
}
