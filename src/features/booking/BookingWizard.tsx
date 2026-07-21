"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { ApiError } from "@/lib/api";
import {
  useAvailabilityDates,
  useMyMembers,
  usePatientSession,
  usePublicDoctor,
  usePublicSettings,
  useSlots,
} from "@/lib/hooks";
import { formatLongDate, hhmm, personMeta, relationshipLabel } from "@/lib/labels";
import {
  confirmBooking,
  releaseBooking,
  startBooking,
  type BookingConfirmation,
  type BookingPayload,
  type PaymentOrderInfo,
  type PatientProfile,
  type PublicClinic,
} from "@/lib/patient-api";
import { BookingCalendar, isoOf } from "@/features/booking/BookingCalendar";
import { loadRazorpay, openRazorpayCheckout } from "@/features/booking/razorpay";
import { MemberFormModal } from "@/features/account/MemberFormModal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";

interface Prefill {
  name: string;
  email?: string;
  contact: string;
}

const MANUAL_ID = "__manual__";
const STEPS = ["Clinic", "Date & time", "Details"];

function todayIso(): string {
  const d = new Date();
  return isoOf(d.getFullYear(), d.getMonth(), d.getDate());
}

function clinicLine(clinic: PublicClinic): string {
  return [clinic.address_line_1, clinic.city, clinic.state].filter(Boolean).join(", ");
}

export interface SessionPrefill {
  clinicId: string;
  date: string;
  slotId: string;
  name: string;
  phone: string;
  email: string;
  age: string;
  gender: string;
  reason: string;
}

export function BookingWizard({ prefill }: { prefill?: SessionPrefill } = {}) {
  const { data: profile, isPending, isError } = usePublicDoctor();
  const { data: settings } = usePublicSettings();
  const { data: session } = usePatientSession();
  const loggedIn = Boolean(session);
  const { data: members } = useMyMembers(loggedIn);

  const startMutation = useMutation({ mutationFn: (p: BookingPayload) => startBooking(p) });
  const confirmMutation = useMutation({
    mutationFn: (args: { holdId: string; payload: Parameters<typeof confirmBooking>[1] }) =>
      confirmBooking(args.holdId, args.payload),
  });

  const [step, setStep] = useState(prefill ? 2 : 0);
  const [clinicId, setClinicId] = useState(prefill?.clinicId ?? "");
  const [date, setDate] = useState(prefill?.date ?? "");
  const [slotId, setSlotId] = useState(prefill?.slotId ?? "");
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const clinics = profile?.clinics ?? [];
  const activeClinicId = clinicId || (clinics.length === 1 ? clinics[0]?.id ?? "" : "");
  const selectedClinic = clinics.find((c) => c.id === activeClinicId) ?? null;

  const { data: slots, isFetching: slotsFetching } = useSlots(
    activeClinicId || null,
    date || null,
  );
  const selectedSlot = slots?.find((s) => s.id === slotId) ?? null;

  const feeAmount = Number(selectedClinic?.consultation_fee ?? 0);
  const needsPayment = Boolean(settings?.payment_required && feeAmount > 0);

  const resetAll = () => {
    setStep(0);
    setClinicId("");
    setDate("");
    setSlotId("");
    setConfirmation(null);
    setProcessing(false);
    setPaymentError(null);
    startMutation.reset();
  };

  const runPayment = (holdId: string, payment: PaymentOrderInfo, prefill: Prefill) => {
    setProcessing(true);
    void loadRazorpay().then((ready) => {
      if (!ready) {
        setProcessing(false);
        setPaymentError("Could not load the payment gateway. Please try again.");
        void releaseBooking(holdId).catch(() => {});
        return;
      }
      const opened = openRazorpayCheckout({
        key: payment.key_id,
        amount: payment.amount,
        currency: payment.currency,
        order_id: payment.order_id,
        name: payment.doctor_name,
        description: `Consultation at ${payment.clinic_name}`,
        prefill: { name: prefill.name, email: prefill.email, contact: prefill.contact },
        theme: { color: "#d1506f" },
        handler: (response) => {
          confirmMutation
            .mutateAsync({
              holdId,
              payload: {
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
            })
            .then((conf) => setConfirmation(conf))
            .catch((err) =>
              setPaymentError(
                err instanceof ApiError
                  ? err.message
                  : "We couldn't verify your payment. Any amount debited will be refunded.",
              ),
            )
            .finally(() => setProcessing(false));
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            setPaymentError("Payment cancelled — your seat has been released.");
            void releaseBooking(holdId).catch(() => {});
          },
        },
      });
      if (!opened) {
        setProcessing(false);
        setPaymentError("Could not open the payment window. Please try again.");
        void releaseBooking(holdId).catch(() => {});
      }
    });
  };

  const submit = (payload: Omit<BookingPayload, "slot_id">, prefill: Prefill) => {
    if (!selectedSlot) return;
    setPaymentError(null);
    startMutation
      .mutateAsync({ slot_id: selectedSlot.id, ...payload })
      .then((result) => {
        if (result.status === "confirmed" && result.appointment) {
          setConfirmation(result.appointment);
        } else if (result.payment && result.hold_id) {
          runPayment(result.hold_id, result.payment, prefill);
        }
      })
      .catch(() => {
        /* surfaced via startMutation.error */
      });
  };

  const submitting = startMutation.isPending || processing;
  const serverError =
    paymentError ??
    (startMutation.error instanceof ApiError
      ? startMutation.error.message
      : startMutation.isError
        ? "Unable to complete the booking. Please try again."
        : null);

  if (isPending) return <p className="text-sm text-sage-500">Loading...</p>;
  if (isError || !profile) return <p className="text-sm text-red-600">Doctor not found.</p>;

  if (confirmation) {
    return <ConfirmationCard confirmation={confirmation} onBookAnother={resetAll} />;
  }

  if (clinics.length === 0) {
    return (
      <div className="rounded-3xl border border-brand-100 bg-white p-10 text-center text-sm text-sage-500 shadow-card">
        Online booking isn&apos;t available yet. Please check back soon or contact the clinic.
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
      <div className="flex min-w-0 flex-col gap-6">
        <Stepper step={step} />
        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-card">
          {step === 0 && (
            <ClinicStep
              clinics={clinics}
              activeClinicId={activeClinicId}
              onSelect={(id) => {
                setClinicId(id);
                setDate("");
                setSlotId("");
              }}
              onContinue={() => setStep(1)}
            />
          )}

          {step === 1 && (
            <DateTimeStep
              clinicId={activeClinicId}
              date={date}
              onSelectDate={(iso) => {
                setDate(iso);
                setSlotId("");
              }}
              slots={slots ?? []}
              slotsFetching={slotsFetching}
              selectedSlotId={slotId}
              onSelectSlot={setSlotId}
              onBack={() => setStep(0)}
              onContinue={() => setStep(2)}
            />
          )}

          {step === 2 && loggedIn && !prefill && (
            <WhoStep
              self={session?.profile ?? null}
              members={members ?? []}
              needsPayment={needsPayment}
              fee={selectedClinic?.consultation_fee ?? null}
              serverError={serverError}
              submitting={submitting}
              onBack={() => setStep(1)}
              onSubmitProfile={(p, reason) =>
                submit(
                  { account_member_id: p.id, reason: reason || null },
                  { name: p.full_name, email: p.email || undefined, contact: p.phone_number },
                )
              }
              onSubmitManual={(m, reason) =>
                submit(
                  {
                    name: m.name,
                    phone_number: m.phone,
                    email: m.email || null,
                    age: m.age ? Number(m.age) : null,
                    gender: m.gender || null,
                    save_as_member: m.save_as_member,
                    relationship: m.save_as_member ? m.relationship : null,
                    reason: reason || null,
                  },
                  { name: m.name, email: m.email || undefined, contact: m.phone },
                )
              }
            />
          )}

          {step === 2 && (!loggedIn || prefill) && (
            <GuestStep
              initial={prefill}
              needsPayment={needsPayment}
              fee={selectedClinic?.consultation_fee ?? null}
              serverError={serverError}
              submitting={submitting}
              onBack={() => setStep(1)}
              onSubmit={(g) =>
                submit(
                  {
                    name: g.name,
                    phone_number: g.phone,
                    email: g.email || null,
                    age: g.age ? Number(g.age) : null,
                    gender: g.gender || null,
                    reason: g.reason || null,
                  },
                  { name: g.name, email: g.email || undefined, contact: g.phone },
                )
              }
            />
          )}
        </div>
      </div>

      <BookingSummary
        doctorName={profile.doctor.full_name}
        specialization={profile.doctor.specialization}
        clinicName={selectedClinic?.clinic_name ?? null}
        date={date ? formatLongDate(date) : null}
        time={selectedSlot ? hhmm(selectedSlot.start_time) : null}
        fee={selectedClinic?.consultation_fee ?? null}
      />
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="flex items-center gap-2 text-xs">
      {STEPS.map((label, i) => {
        const active = i === step;
        const done = i < step;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                active || done ? "bg-brand-500 text-white" : "bg-sage-100 text-sage-500"
              }`}
            >
              {i + 1}
            </span>
            <span className={active ? "font-semibold text-sage-800" : "text-sage-400"}>{label}</span>
            {i < STEPS.length - 1 && <span className="mx-1 h-px w-6 bg-brand-100" />}
          </li>
        );
      })}
    </ol>
  );
}

function StepHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-bold text-sage-900">{title}</h2>
      <p className="text-sm text-sage-500">{subtitle}</p>
    </div>
  );
}

function ClinicStep({
  clinics,
  activeClinicId,
  onSelect,
  onContinue,
}: {
  clinics: PublicClinic[];
  activeClinicId: string;
  onSelect: (id: string) => void;
  onContinue: () => void;
}) {
  return (
    <div>
      <StepHeading title="Choose a clinic" subtitle="Where would you like to be seen?" />
      <div className="flex flex-col gap-3">
        {clinics.map((clinic) => {
          const active = clinic.id === activeClinicId;
          return (
            <button
              key={clinic.id}
              type="button"
              onClick={() => onSelect(clinic.id)}
              className={`rounded-2xl border p-4 text-left transition-colors ${
                active ? "border-brand-400 bg-brand-50/60 ring-1 ring-brand-200" : "border-brand-100 hover:bg-sage-50"
              }`}
            >
              <p className="font-semibold text-sage-800">{clinic.clinic_name}</p>
              <p className="text-sm text-sage-500">{clinicLine(clinic)}</p>
              {clinic.consultation_fee && (
                <p className="mt-0.5 text-sm text-sage-500">
                  Consultation fee: ₹{clinic.consultation_fee}
                </p>
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={onContinue} disabled={!activeClinicId}>
          Continue
        </Button>
      </div>
    </div>
  );
}

function DateTimeStep({
  clinicId,
  date,
  onSelectDate,
  slots,
  slotsFetching,
  selectedSlotId,
  onSelectSlot,
  onBack,
  onContinue,
}: {
  clinicId: string;
  date: string;
  onSelectDate: (iso: string) => void;
  slots: { id: string; start_time: string; available_count: number; capacity: number }[];
  slotsFetching: boolean;
  selectedSlotId: string;
  onSelectSlot: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const today = useMemo(() => new Date(), []);
  const todayStr = isoOf(today.getFullYear(), today.getMonth(), today.getDate());
  const [view, setView] = useState(() => {
    if (date) {
      const parts = date.split("-").map(Number);
      return { year: parts[0] ?? today.getFullYear(), month: (parts[1] ?? 1) - 1 };
    }
    return { year: today.getFullYear(), month: today.getMonth() };
  });

  const monthFrom = isoOf(view.year, view.month, 1);
  const lastDay = new Date(view.year, view.month + 1, 0).getDate();
  const monthTo = isoOf(view.year, view.month, lastDay);

  const { data: availableRaw, isFetching: datesFetching } = useAvailabilityDates(
    clinicId || null,
    clinicId ? monthFrom : null,
    clinicId ? monthTo : null,
  );
  const availableDates = useMemo(() => new Set(availableRaw ?? []), [availableRaw]);

  const currentIndex = today.getFullYear() * 12 + today.getMonth();
  const viewIndex = view.year * 12 + view.month;
  const shiftMonth = (delta: number) =>
    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  return (
    <div>
      <StepHeading
        title="Pick a date & time"
        subtitle="Dates with open slots are selectable; others are greyed out."
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-medium text-sage-700">Date</p>
          <BookingCalendar
            year={view.year}
            month={view.month}
            todayIso={todayStr}
            selected={date}
            availableDates={availableDates}
            onSelect={onSelectDate}
            onPrev={() => shiftMonth(-1)}
            onNext={() => shiftMonth(1)}
            canPrev={viewIndex > currentIndex}
            canNext={viewIndex < currentIndex + 3}
            loading={datesFetching}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-sage-700">
            {date ? "Available times" : "Times"}
          </p>
          {!date ? (
            <div className="flex min-h-40 items-center justify-center rounded-2xl border border-brand-50 bg-cream-100/50 p-6 text-center text-sm text-sage-500">
              Select a date to see available times.
            </div>
          ) : slotsFetching ? (
            <p className="text-sm text-sage-500">Loading times...</p>
          ) : slots.length === 0 ? (
            <div className="rounded-2xl border border-brand-50 bg-cream-100/50 p-6 text-center text-sm text-sage-500">
              No available times on this day. Try another date.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2">
                {slots.map((s) => {
                  const bookable = s.available_count > 0;
                  const plenty = s.available_count > s.capacity / 2;
                  const active = s.id === selectedSlotId;
                  const box = active
                    ? "border-brand-400 bg-brand-500 text-white"
                    : !bookable
                      ? "cursor-not-allowed border-sage-100 bg-sage-50 text-sage-300"
                      : plenty
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                        : "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100";
                  const sub = active
                    ? "text-white/80"
                    : !bookable
                      ? "text-sage-300"
                      : plenty
                        ? "text-emerald-700"
                        : "text-amber-700";
                  return (
                    <button
                      key={s.id}
                      type="button"
                      disabled={!bookable}
                      onClick={() => onSelectSlot(s.id)}
                      className={`flex flex-col items-center rounded-lg border py-1.5 text-sm transition-colors ${box}`}
                    >
                      <span className="font-semibold">{hhmm(s.start_time)}</span>
                      <span className={`text-[10px] ${sub}`}>
                        {bookable ? `${s.available_count} left` : "Full"}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-sage-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Available
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Filling fast
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-sage-300" />
                  Full
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onContinue} disabled={!selectedSlotId}>
          Continue
        </Button>
      </div>
    </div>
  );
}

function PaymentNote({ fee }: { fee: string | null }) {
  return (
    <p className="rounded-xl border border-brand-100 bg-brand-50 px-3 py-2 text-sm text-brand-700">
      A secure payment of ₹{fee} is required to confirm this appointment.
    </p>
  );
}

function GuestStep({
  initial,
  needsPayment,
  fee,
  serverError,
  submitting,
  onBack,
  onSubmit,
}: {
  initial?: SessionPrefill;
  needsPayment: boolean;
  fee: string | null;
  serverError: string | null;
  submitting: boolean;
  onBack: () => void;
  onSubmit: (g: {
    name: string;
    phone: string;
    email: string;
    age: string;
    gender: string;
    reason: string;
  }) => void;
}) {
  const [form, setForm] = useState(() => ({
    name: initial?.name ?? "",
    phone: initial?.phone ?? "",
    email: initial?.email ?? "",
    age: initial?.age ?? "",
    gender: initial?.gender ?? "",
    reason: initial?.reason ?? "",
  }));
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.phone.trim()) {
          setError("Name and mobile number are required.");
          return;
        }
        setError(null);
        onSubmit(form);
      }}
    >
      <StepHeading title="Your details" subtitle="We'll use these to confirm your appointment." />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-brand-50 bg-cream-100/50 px-3 py-2 text-sm">
        <span className="text-sage-500">Have an account? Sign in to use your saved details.</span>
        <Link href="/login?redirect=book" className="font-medium text-brand-600 hover:underline">
          Sign in
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" className="sm:col-span-2">
          <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </Field>
        <Field label="Mobile number">
          <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
        </Field>
        <Field label="Email (optional)">
          <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        </Field>
        <Field label="Age (optional)">
          <Input type="number" min={0} value={form.age} onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))} />
        </Field>
        <Field label="Gender (optional)">
          <Select value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}>
            <option value="">Prefer not to say</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </Select>
        </Field>
        <Field label="Reason for visit (optional)" className="sm:col-span-2">
          <textarea
            rows={3}
            className="rounded-xl border border-sage-200 bg-white px-4 py-2 text-sm text-sage-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            value={form.reason}
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
          />
        </Field>
      </div>

      {needsPayment && (
        <div className="mt-4">
          <PaymentNote fee={fee} />
        </div>
      )}
      {(error || serverError) && <p className="mt-4 text-sm text-red-600">{error ?? serverError}</p>}

      <div className="mt-6 flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={onBack} disabled={submitting}>
          Back
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? <Spinner /> : null}
          {submitting ? "Please wait..." : needsPayment ? `Pay ₹${fee} & confirm` : "Confirm booking"}
        </Button>
      </div>
    </form>
  );
}

function WhoStep({
  self,
  members,
  needsPayment,
  fee,
  serverError,
  submitting,
  onBack,
  onSubmitProfile,
  onSubmitManual,
}: {
  self: PatientProfile | null;
  members: PatientProfile[];
  needsPayment: boolean;
  fee: string | null;
  serverError: string | null;
  submitting: boolean;
  onBack: () => void;
  onSubmitProfile: (profile: PatientProfile, reason: string) => void;
  onSubmitManual: (
    m: {
      name: string;
      phone: string;
      email: string;
      age: string;
      gender: string;
      save_as_member: boolean;
      relationship: string;
    },
    reason: string,
  ) => void;
}) {
  const profiles = useMemo(() => (self ? [self, ...members] : members), [self, members]);
  const [selectedId, setSelectedId] = useState(profiles[0]?.id ?? MANUAL_ID);
  const [reason, setReason] = useState("");
  const [memberOpen, setMemberOpen] = useState(false);
  const [manual, setManual] = useState({ name: "", phone: "", email: "", age: "", gender: "" });
  const [save, setSave] = useState(false);
  const [relationship, setRelationship] = useState("OTHER");
  const [error, setError] = useState<string | null>(null);

  const isManual = selectedId === MANUAL_ID;

  const confirm = () => {
    if (isManual) {
      if (!manual.name.trim() || !manual.phone.trim()) {
        setError("Name and mobile number are required.");
        return;
      }
      setError(null);
      onSubmitManual({ ...manual, save_as_member: save, relationship }, reason.trim());
      return;
    }
    const chosen = profiles.find((p) => p.id === selectedId);
    if (!chosen) {
      setError("Please choose who this appointment is for.");
      return;
    }
    setError(null);
    onSubmitProfile(chosen, reason.trim());
  };

  return (
    <div>
      <StepHeading
        title="Who is this appointment for?"
        subtitle="Choose a saved profile or enter someone else's details."
      />

      <div className="flex flex-col gap-2">
        {profiles.map((p) => {
          const active = p.id === selectedId;
          const isSelf = p.relationship === "SELF";
          const meta = [isSelf ? "You" : relationshipLabel(p.relationship), personMeta(p.age, p.gender)]
            .filter(Boolean)
            .join(" · ");
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedId(p.id)}
              className={`rounded-2xl border p-3 text-left transition-colors ${
                active ? "border-brand-400 bg-brand-50/60 ring-1 ring-brand-200" : "border-brand-100 hover:bg-sage-50"
              }`}
            >
              <p className="text-sm font-semibold text-sage-800">{p.full_name}</p>
              {meta && <p className="text-xs text-sage-400">{meta}</p>}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setSelectedId(MANUAL_ID)}
          className={`rounded-2xl border p-3 text-left transition-colors ${
            isManual ? "border-brand-400 bg-brand-50/60 ring-1 ring-brand-200" : "border-brand-100 hover:bg-sage-50"
          }`}
        >
          <p className="text-sm font-semibold text-sage-800">Someone else</p>
          <p className="text-xs text-sage-400">Enter their details manually</p>
        </button>

        <button
          type="button"
          onClick={() => setMemberOpen(true)}
          className="rounded-2xl border border-dashed border-brand-200 p-3 text-sm text-sage-500 transition-colors hover:bg-sage-50 hover:text-sage-800"
        >
          + Add a family member
        </button>
      </div>

      {isManual && (
        <div className="mt-4 grid gap-4 rounded-2xl border border-brand-50 p-4 sm:grid-cols-2">
          <Field label="Full name" className="sm:col-span-2">
            <Input value={manual.name} onChange={(e) => setManual((m) => ({ ...m, name: e.target.value }))} />
          </Field>
          <Field label="Mobile number">
            <Input value={manual.phone} onChange={(e) => setManual((m) => ({ ...m, phone: e.target.value }))} />
          </Field>
          <Field label="Email (optional)">
            <Input type="email" value={manual.email} onChange={(e) => setManual((m) => ({ ...m, email: e.target.value }))} />
          </Field>
          <Field label="Age (optional)">
            <Input type="number" min={0} value={manual.age} onChange={(e) => setManual((m) => ({ ...m, age: e.target.value }))} />
          </Field>
          <Field label="Gender (optional)">
            <Select value={manual.gender} onChange={(e) => setManual((m) => ({ ...m, gender: e.target.value }))}>
              <option value="">Prefer not to say</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </Select>
          </Field>
          <label className="flex items-center gap-2 text-sm text-sage-700 sm:col-span-2">
            <input type="checkbox" checked={save} onChange={(e) => setSave(e.target.checked)} />
            Save to my family members for next time
          </label>
          {save && (
            <Field label="Relationship" className="sm:col-span-2">
              <Select value={relationship} onChange={(e) => setRelationship(e.target.value)}>
                {["SPOUSE", "FATHER", "MOTHER", "SON", "DAUGHTER", "BROTHER", "SISTER", "GUARDIAN", "OTHER"].map(
                  (rel) => (
                    <option key={rel} value={rel}>
                      {relationshipLabel(rel as PatientProfile["relationship"])}
                    </option>
                  ),
                )}
              </Select>
            </Field>
          )}
        </div>
      )}

      <div className="mt-4">
        <Field label="Reason for visit (optional)">
          <textarea
            rows={3}
            className="w-full rounded-xl border border-sage-200 bg-white px-4 py-2 text-sm text-sage-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </Field>
      </div>

      {needsPayment && (
        <div className="mt-4">
          <PaymentNote fee={fee} />
        </div>
      )}
      {(error || serverError) && <p className="mt-4 text-sm text-red-600">{error ?? serverError}</p>}

      <div className="mt-6 flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={onBack} disabled={submitting}>
          Back
        </Button>
        <Button type="button" onClick={confirm} disabled={submitting}>
          {submitting ? "Please wait..." : needsPayment ? `Pay ₹${fee} & confirm` : "Confirm booking"}
        </Button>
      </div>

      <MemberFormModal
        open={memberOpen}
        onClose={() => setMemberOpen(false)}
        onSaved={(saved) => setSelectedId(saved.id)}
      />
    </div>
  );
}

function Field({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-semibold text-sage-700">{label}</span>
      {children}
    </div>
  );
}

function BookingSummary({
  doctorName,
  specialization,
  clinicName,
  date,
  time,
  fee,
}: {
  doctorName: string;
  specialization: string;
  clinicName: string | null;
  date: string | null;
  time: string | null;
  fee: string | null;
}) {
  return (
    <aside className="h-fit rounded-3xl border border-brand-100 bg-white p-5 shadow-card lg:sticky lg:top-24">
      <p className="font-bold text-sage-900">{doctorName}</p>
      <p className="text-sm text-brand-600">{specialization}</p>
      <div className="my-4 h-px bg-brand-50" />
      <dl className="flex flex-col gap-2 text-sm">
        <SummaryRow label="Clinic" value={clinicName} />
        <SummaryRow label="Date" value={date} />
        <SummaryRow label="Time" value={time} />
        {fee && <SummaryRow label="Fee" value={`₹${fee}`} />}
      </dl>
    </aside>
  );
}

function SummaryRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sage-400">{label}</span>
      <span className={value ? "font-medium text-sage-800" : "text-sage-300"}>
        {value ?? "Not selected"}
      </span>
    </div>
  );
}

function ConfirmationCard({
  confirmation,
  onBookAnother,
}: {
  confirmation: BookingConfirmation;
  onBookAnother: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-brand-100 bg-white p-8 text-center shadow-card">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-sage-700">
        ✓
      </div>
      <h2 className="text-xl font-bold text-sage-900">Appointment confirmed</h2>
      <p className="mt-1 text-sm text-sage-500">
        A confirmation has been recorded. Please arrive a few minutes early.
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-cream-100/60 p-5 text-left text-sm">
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-sage-400">Appointment</dt>
          <dd className="font-semibold text-sage-800">{confirmation.appointment_number}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-sage-400">Token</dt>
          <dd className="font-semibold text-sage-800">#{confirmation.token_number}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-sage-400">Date</dt>
          <dd className="font-semibold text-sage-800">{formatLongDate(confirmation.appointment_date)}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-sage-400">Time</dt>
          <dd className="font-semibold text-sage-800">
            {hhmm(confirmation.start_time)} – {hhmm(confirmation.end_time)}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[11px] uppercase tracking-wider text-sage-400">Clinic</dt>
          <dd className="font-semibold text-sage-800">{confirmation.clinic_name}</dd>
          <dd className="text-xs text-sage-500">{confirmation.clinic_address}</dd>
        </div>
      </dl>

      <div className="mt-6 flex justify-center gap-3">
        <Button variant="ghost" onClick={onBookAnother}>
          Book another
        </Button>
        <Link href="/account">
          <Button>View my appointments</Button>
        </Link>
      </div>
    </div>
  );
}
