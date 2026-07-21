export type AppointmentStatus = "scheduled" | "rescheduled" | "cancelled" | "completed";

export interface Doctor {
  doctor_id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience_years: number;
  clinic_name: string;
  clinic_address: string;
  hospital: string | null;
  consultation_fee: number;
  languages: string[];
  availability: Record<string, string>;
  photo_url: string | null;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  years: string;
}

export interface ExperienceEntry {
  role: string;
  place: string;
  years: string;
}

export interface DoctorKnowledge {
  doctor: Doctor;
  title: string;
  bio: string;
  expertise: string[];
  education: EducationEntry[];
  experience: ExperienceEntry[];
  workshops: string[];
  contact_email: string | null;
  phone: string | null;
  phone_alt: string | null;
  faq: { question: string; answer: string }[];
  emergency_instructions: string;
  conversation_guidelines: Record<string, string>;
}

export interface Appointment {
  appointment_id: string;
  doctor_id: number;
  patient_name: string;
  phone: string;
  appointment_date: string;
  appointment_time: string;
  reason: string | null;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
}

export interface TranscriptEntry {
  id: string;
  role: "patient" | "assistant";
  text: string;
  timestamp: string;
}

export type ConnectionStatus = "idle" | "connecting" | "connected" | "disconnected" | "error";
export type MicStatus = "muted" | "listening" | "speaking";
