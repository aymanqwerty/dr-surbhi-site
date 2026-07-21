// This is Dr. Surbhi's single-doctor site — every backend call is scoped to her.
export const DOCTOR_SLUG = "dr-surbhi";

const ORIGIN = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

// Backend REST base (the API lives under /api/v1) and the bare origin (for media).
export const API_BASE_URL = `${ORIGIN}/api/v1`;
export const API_ORIGIN = ORIGIN;
