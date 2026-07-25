"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { ApiError } from "@/lib/api";
import { useSessionRefresh } from "@/lib/hooks";
import {
  loginWithPassword,
  requestOtp,
  upsertProfile,
  verifyOtp,
  type Gender,
  type PatientAuthData,
} from "@/lib/patient-api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";

type Step = "phone" | "code" | "profile" | "password";

function errText(error: unknown, fallback: string): string | null {
  if (error instanceof ApiError) return error.message;
  return error ? fallback : null;
}

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-semibold text-sage-700">
      {children}
    </label>
  );
}

function ErrorText({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="text-sm text-red-600" role="alert">
      {message}
    </p>
  );
}

/**
 * Mobile-number field: patients just type their 10-digit number. The country
 * code is shown as a fixed "+91" prefix — never typed — and input is restricted
 * to digits. The backend canonicalises anyway, but this keeps entry foolproof.
 */
function PhoneField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-stretch overflow-hidden rounded-xl border border-sage-200 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
      <span className="flex items-center border-r border-sage-200 bg-sage-50 px-3 text-sm font-medium text-sage-600">
        +91
      </span>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        maxLength={10}
        placeholder="10-digit mobile number"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
        className="min-w-0 flex-1 bg-white px-4 py-2.5 text-sm text-sage-900 placeholder:text-sage-400 focus:outline-none focus-visible:shadow-none"
      />
    </div>
  );
}

export function AuthFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirect") === "book" ? "/book" : "/account";
  const refresh = useSessionRefresh();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [debugCode, setDebugCode] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    full_name: "",
    gender: "",
    date_of_birth: "",
    email: "",
  });
  const [pwPhone, setPwPhone] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const finish = () => {
    refresh();
    router.push(redirectTo);
    router.refresh();
  };

  const afterAuth = (data: PatientAuthData) => {
    refresh();
    if (data.account.profile_complete) finish();
    else setStep("profile");
  };

  const otpMutation = useMutation({
    mutationFn: (targetPhone: string) => requestOtp(targetPhone),
    onSuccess: (res, targetPhone) => {
      setPhone(targetPhone);
      setDebugCode(res.debug_code);
      setStep("code");
    },
  });
  const verifyMutation = useMutation({
    mutationFn: () => verifyOtp(phone, code),
    onSuccess: afterAuth,
  });
  const passwordMutation = useMutation({
    mutationFn: () => loginWithPassword(pwPhone, password),
    onSuccess: afterAuth,
  });
  const profileMutation = useMutation({
    mutationFn: () =>
      upsertProfile({
        full_name: profile.full_name,
        gender: (profile.gender || null) as Gender | null,
        date_of_birth: profile.date_of_birth || null,
        email: profile.email || null,
      }),
    onSuccess: finish,
  });

  return (
    <div className="w-full max-w-sm rounded-3xl border border-sage-200/70 bg-white p-8 shadow-soft">
      <h2 className="text-xl font-bold text-sage-900">
        {step === "profile" ? "Complete your profile" : "Sign in to book"}
      </h2>
      <p className="mt-1 text-sm text-sage-500">
        {step === "phone" && "Enter your mobile number and we'll send a verification code."}
        {step === "code" && `Enter the code sent to ${phone}.`}
        {step === "profile" && "Tell us a bit about yourself to pre-fill your bookings."}
        {step === "password" && "Sign in with your mobile number and password."}
      </p>

      {step === "phone" && (
        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setLocalError(null);
            if (phone.length !== 10) {
              setLocalError("Enter your 10-digit mobile number.");
              return;
            }
            otpMutation.mutate(phone);
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Mobile number</Label>
            <PhoneField id="phone" value={phone} onChange={setPhone} />
          </div>
          <ErrorText message={localError ?? errText(otpMutation.error, "Could not send the code.")} />
          <Button type="submit" disabled={otpMutation.isPending}>
            {otpMutation.isPending ? <Spinner /> : null}
            {otpMutation.isPending ? "Sending..." : "Send code"}
          </Button>
          <button
            type="button"
            className="text-sm text-sage-500 hover:text-sage-800"
            onClick={() => {
              setLocalError(null);
              setStep("password");
            }}
          >
            Sign in with a password instead
          </button>
        </form>
      )}

      {step === "code" && (
        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setLocalError(null);
            if (!/^\d{4,10}$/.test(code.trim())) {
              setLocalError("Enter the numeric code you received.");
              return;
            }
            verifyMutation.mutate();
          }}
        >
          {debugCode && (
            <p className="rounded-xl border border-brand-100 bg-brand-50 px-3 py-2 text-sm text-brand-700">
              Development mode — your code is{" "}
              <span className="font-mono font-bold">{debugCode}</span>
            </p>
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="code">Verification code</Label>
            <Input
              id="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <ErrorText
            message={localError ?? errText(verifyMutation.error, "Could not verify the code.")}
          />
          <Button type="submit" disabled={verifyMutation.isPending}>
            {verifyMutation.isPending ? "Verifying..." : "Verify & continue"}
          </Button>
          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              className="text-sage-500 hover:text-sage-800"
              onClick={() => {
                setCode("");
                verifyMutation.reset();
                setStep("phone");
              }}
            >
              Change number
            </button>
            <button
              type="button"
              className="text-brand-600 hover:underline disabled:opacity-50"
              disabled={otpMutation.isPending}
              onClick={() => otpMutation.mutate(phone)}
            >
              {otpMutation.isPending ? "Sending..." : "Resend code"}
            </button>
          </div>
        </form>
      )}

      {step === "profile" && (
        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setLocalError(null);
            if (!profile.full_name.trim()) {
              setLocalError("Please enter your name.");
              return;
            }
            profileMutation.mutate();
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="full_name">Full name</Label>
            <Input
              id="full_name"
              value={profile.full_name}
              onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gender">Gender</Label>
              <Select
                id="gender"
                value={profile.gender}
                onChange={(e) => setProfile((p) => ({ ...p, gender: e.target.value }))}
              >
                <option value="">Prefer not to say</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dob">Date of birth</Label>
              <Input
                id="dob"
                type="date"
                value={profile.date_of_birth}
                onChange={(e) => setProfile((p) => ({ ...p, date_of_birth: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
            />
          </div>
          <ErrorText
            message={localError ?? errText(profileMutation.error, "Could not save your profile.")}
          />
          <Button type="submit" disabled={profileMutation.isPending}>
            {profileMutation.isPending ? "Saving..." : "Save & continue"}
          </Button>
        </form>
      )}

      {step === "password" && (
        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setLocalError(null);
            if (pwPhone.length !== 10 || !password) {
              setLocalError("Enter your 10-digit mobile number and password.");
              return;
            }
            passwordMutation.mutate();
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pw_phone">Mobile number</Label>
            <PhoneField id="pw_phone" value={pwPhone} onChange={setPwPhone} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pw">Password</Label>
            <Input
              id="pw"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <ErrorText
            message={localError ?? errText(passwordMutation.error, "Could not sign you in.")}
          />
          <Button type="submit" disabled={passwordMutation.isPending}>
            {passwordMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
          <button
            type="button"
            className="text-sm text-sage-500 hover:text-sage-800"
            onClick={() => {
              setLocalError(null);
              setStep("phone");
            }}
          >
            Sign in with a code instead
          </button>
        </form>
      )}
    </div>
  );
}
