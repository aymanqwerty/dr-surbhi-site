import { apiFetch, ApiError } from "@/lib/api";
import { clearToken, setToken } from "@/lib/auth-token";
import { DOCTOR_SLUG } from "@/lib/config";

// ---------------------------------------------------------------- types

export type Gender = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";

export type PatientRelationship =
  | "SELF"
  | "SPOUSE"
  | "FATHER"
  | "MOTHER"
  | "SON"
  | "DAUGHTER"
  | "BROTHER"
  | "SISTER"
  | "GUARDIAN"
  | "OTHER";

export const MEMBER_RELATIONSHIPS: PatientRelationship[] = [
  "SPOUSE",
  "FATHER",
  "MOTHER",
  "SON",
  "DAUGHTER",
  "BROTHER",
  "SISTER",
  "GUARDIAN",
  "OTHER",
];

export interface PatientProfile {
  id: string;
  full_name: string;
  phone_number: string;
  email: string | null;
  gender: Gender | null;
  date_of_birth: string | null;
  age: number | null;
  relationship: PatientRelationship | null;
}

export interface AccountSummary {
  id: string;
  doctor_slug: string;
  phone_number: string;
  is_verified: boolean;
  has_password: boolean;
  profile_complete: boolean;
}

export interface PatientAuthData {
  token: string;
  account: AccountSummary;
  profile: PatientProfile | null;
  is_new: boolean;
}

export interface MeResponse {
  account: AccountSummary;
  profile: PatientProfile | null;
}

export interface RequestOtpResponse {
  expires_in_seconds: number;
  debug_code: string | null;
}

export interface MyAppointment {
  id: string;
  appointment_number: string;
  token_number: number;
  appointment_status: string;
  patient_id: string;
  patient_name: string;
  doctor_name: string;
  clinic_name: string;
  clinic_address: string;
  consultation_fee: string | null;
  appointment_date: string;
  start_time: string;
  end_time: string;
}

export interface ProfilePayload {
  full_name: string;
  email?: string | null;
  gender?: Gender | null;
  date_of_birth?: string | null;
  age?: number | null;
}

export interface MemberPayload {
  full_name: string;
  relationship: PatientRelationship;
  phone_number?: string | null;
  email?: string | null;
  gender?: Gender | null;
  date_of_birth?: string | null;
  age?: number | null;
}

export interface PublicClinic {
  id: string;
  clinic_name: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  country: string;
  google_maps_url: string | null;
  phone_number: string | null;
  consultation_fee: string | null;
}

export interface PublicDoctor {
  full_name: string;
  slug: string;
  specialization: string;
  qualification: string | null;
  about: string | null;
  profile_photo: string | null;
  experience_years: number;
  languages: string[] | null;
}

export interface PublicDoctorProfile {
  doctor: PublicDoctor;
  clinics: PublicClinic[];
}

export interface PublicSettings {
  booking_enabled: boolean;
  gallery_enabled: boolean;
  show_consultation_fee: boolean;
  show_contact_information: boolean;
  payment_required: boolean;
}

export interface PublicSlot {
  id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  remaining: number;
  available_count: number;
}

export interface BookingConfirmation {
  id: string;
  appointment_number: string;
  token_number: number;
  appointment_status: string;
  doctor_name: string;
  clinic_name: string;
  clinic_address: string;
  consultation_fee: string | null;
  appointment_date: string;
  start_time: string;
  end_time: string;
}

export interface PaymentOrderInfo {
  provider: string;
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  display_amount: string;
  doctor_name: string;
  clinic_name: string;
}

export interface BookingStartResponse {
  status: "confirmed" | "payment_required";
  hold_id: string | null;
  appointment: BookingConfirmation | null;
  payment: PaymentOrderInfo | null;
}

export interface BookingPayload {
  slot_id: string;
  name?: string;
  phone_number?: string;
  email?: string | null;
  age?: number | null;
  gender?: string | null;
  account_member_id?: string | null;
  save_as_member?: boolean;
  relationship?: string | null;
  reason?: string | null;
}

export interface ConfirmPaymentPayload {
  order_id: string;
  payment_id: string;
  signature: string;
}

export interface BookingSessionData {
  token: string;
  doctor_slug: string;
  clinic_id: string | null;
  clinic_name: string | null;
  slot_id: string | null;
  slot_date: string | null;
  start_time: string | null;
  end_time: string | null;
  name: string;
  phone_number: string;
  email: string | null;
  age: number | null;
  gender: Gender | null;
  reason: string | null;
  expires_at: string;
}

// ------------------------------------------------------------- auth

export function requestOtp(phoneNumber: string): Promise<RequestOtpResponse> {
  return apiFetch<RequestOtpResponse>("/patient-auth/request-otp", {
    method: "POST",
    body: JSON.stringify({ doctor_slug: DOCTOR_SLUG, phone_number: phoneNumber }),
  });
}

export async function verifyOtp(
  phoneNumber: string,
  code: string,
): Promise<PatientAuthData> {
  const data = await apiFetch<PatientAuthData>("/patient-auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({
      doctor_slug: DOCTOR_SLUG,
      phone_number: phoneNumber,
      code,
    }),
  });
  setToken(data.token);
  return data;
}

export async function loginWithPassword(
  phoneNumber: string,
  password: string,
): Promise<PatientAuthData> {
  const data = await apiFetch<PatientAuthData>("/patient-auth/login", {
    method: "POST",
    body: JSON.stringify({
      doctor_slug: DOCTOR_SLUG,
      phone_number: phoneNumber,
      password,
    }),
  });
  setToken(data.token);
  return data;
}

export async function getMe(): Promise<MeResponse | null> {
  try {
    return await apiFetch<MeResponse>("/patient-auth/me");
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export function setPatientPassword(password: string): Promise<null> {
  return apiFetch<null>("/patient-auth/set-password", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

export async function patientLogout(): Promise<void> {
  try {
    await apiFetch<null>("/patient-auth/logout", { method: "POST" });
  } catch {
    // Ignore — clearing the token below is what actually signs the patient out.
  }
  clearToken();
}

// ---------------------------------------------------------- account

export function getProfile(): Promise<PatientProfile | null> {
  return apiFetch<PatientProfile | null>("/patient-account/profile");
}

export function upsertProfile(payload: ProfilePayload): Promise<PatientProfile> {
  return apiFetch<PatientProfile>("/patient-account/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function listMembers(): Promise<PatientProfile[]> {
  return apiFetch<PatientProfile[]>("/patient-account/members");
}

export function addMember(payload: MemberPayload): Promise<PatientProfile> {
  return apiFetch<PatientProfile>("/patient-account/members", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateMember(
  memberId: string,
  payload: Partial<MemberPayload>,
): Promise<PatientProfile> {
  return apiFetch<PatientProfile>(`/patient-account/members/${memberId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteMember(memberId: string): Promise<null> {
  return apiFetch<null>(`/patient-account/members/${memberId}`, {
    method: "DELETE",
  });
}

export function listMyAppointments(): Promise<MyAppointment[]> {
  return apiFetch<MyAppointment[]>("/patient-account/appointments");
}

// ------------------------------------------------------ public / booking

export function getPublicDoctor(): Promise<PublicDoctorProfile> {
  return apiFetch<PublicDoctorProfile>(`/doctors/public/${DOCTOR_SLUG}`);
}

export function getPublicSettings(): Promise<PublicSettings> {
  return apiFetch<PublicSettings>(`/doctors/public/${DOCTOR_SLUG}/settings`);
}

export function listSlots(
  clinicId: string,
  slotDate: string,
): Promise<PublicSlot[]> {
  const params = new URLSearchParams({
    doctor_slug: DOCTOR_SLUG,
    clinic_id: clinicId,
    slot_date: slotDate,
  });
  return apiFetch<PublicSlot[]>(`/public/slots?${params.toString()}`);
}

export function listAvailabilityDates(
  clinicId: string,
  dateFrom: string,
  dateTo: string,
): Promise<string[]> {
  const params = new URLSearchParams({
    doctor_slug: DOCTOR_SLUG,
    clinic_id: clinicId,
    date_from: dateFrom,
    date_to: dateTo,
  });
  return apiFetch<string[]>(`/public/availability-dates?${params.toString()}`);
}

export function startBooking(
  payload: BookingPayload,
): Promise<BookingStartResponse> {
  return apiFetch<BookingStartResponse>("/public/bookings", {
    method: "POST",
    body: JSON.stringify({ doctor_slug: DOCTOR_SLUG, ...payload }),
  });
}

export function confirmBooking(
  holdId: string,
  payload: ConfirmPaymentPayload,
): Promise<BookingConfirmation> {
  return apiFetch<BookingConfirmation>(`/public/bookings/${holdId}/confirm`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function releaseBooking(holdId: string): Promise<null> {
  return apiFetch<null>(`/public/bookings/${holdId}/release`, {
    method: "POST",
  });
}

export function getBookingSession(token: string): Promise<BookingSessionData> {
  return apiFetch<BookingSessionData>(`/public/booking-sessions/${token}`);
}

/** A short-lived WebRTC token for the voice agent (works for private agents). */
export function getVoiceToken(): Promise<{ token: string }> {
  return apiFetch<{ token: string }>(
    `/public/voice-token?doctor_slug=${DOCTOR_SLUG}`,
  );
}
