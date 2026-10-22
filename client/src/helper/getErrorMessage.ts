import axios from "axios";

export function getErrorMessage(error: unknown): string | undefined;
export function getErrorMessage(error: unknown, fallback: string): string;
export function getErrorMessage(
  error: unknown,
  fallback?: string,
): string | undefined {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: unknown } | undefined;
    const message = data?.message;

    if (typeof message === "string") {
      return message;
    }
  }

  return fallback;
}
