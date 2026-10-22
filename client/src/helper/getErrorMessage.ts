import axios from "axios";

export const getErrorMessage = (
  error: unknown,
  fallback?: string,
): string | undefined => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: unknown } | undefined;
    const message = data?.message;

    if (typeof message === "string") {
      return message;
    }
  }

  return fallback;
};
