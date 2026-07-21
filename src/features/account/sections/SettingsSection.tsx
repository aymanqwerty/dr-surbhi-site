"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { SectionCard } from "@/features/account/SectionCard";
import { usePatientSession, useSessionRefresh } from "@/lib/hooks";
import { patientLogout, setPatientPassword } from "@/lib/patient-api";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function SettingsSection() {
  const router = useRouter();
  const refresh = useSessionRefresh();
  const { data: session } = usePatientSession();
  const hasPassword = session?.account.has_password ?? false;

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const passwordMutation = useMutation({
    mutationFn: () => setPatientPassword(password),
    onSuccess: () => {
      setPassword("");
      refresh();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => patientLogout(),
    onSuccess: () => {
      refresh();
      router.push("/");
      router.refresh();
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <SectionCard
        title={hasPassword ? "Change password" : "Set a password"}
        description="Optional — lets you sign in with a password instead of an OTP."
      >
        <form
          className="flex flex-col gap-3 sm:flex-row sm:items-start"
          onSubmit={(e) => {
            e.preventDefault();
            if (password.length < 8) {
              setError("Use at least 8 characters.");
              return;
            }
            setError(null);
            passwordMutation.mutate();
          }}
        >
          <div className="flex flex-1 flex-col gap-1.5">
            <Input
              type="password"
              autoComplete="new-password"
              placeholder="New password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
            {(error ||
              (passwordMutation.error instanceof ApiError
                ? passwordMutation.error.message
                : null)) && (
              <p className="text-sm text-red-600">
                {error ?? (passwordMutation.error as ApiError).message}
              </p>
            )}
            {passwordMutation.isSuccess && (
              <p className="text-sm text-sage-600">Password updated.</p>
            )}
          </div>
          <Button type="submit" disabled={passwordMutation.isPending}>
            {passwordMutation.isPending ? "Saving..." : "Save password"}
          </Button>
        </form>
      </SectionCard>

      <SectionCard title="Sign out" description="Sign out of your account on this device.">
        <Button
          variant="danger"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          Sign out
        </Button>
      </SectionCard>
    </div>
  );
}
