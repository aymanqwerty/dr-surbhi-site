import { API_BASE_URL } from "@/lib/config";
import { getToken } from "@/lib/auth-token";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  error_code?: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly errorCode?: string;

  constructor(message: string, status: number, errorCode?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorCode = errorCode;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const body = (await response.json()) as ApiEnvelope<T>;
  if (!response.ok || !body.success) {
    throw new ApiError(
      body.message ?? "Request failed",
      response.status,
      body.error_code,
    );
  }
  return body.data;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  return handleResponse<T>(response);
}
