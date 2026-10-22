import { QueryCache, QueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const getMessage = (value: unknown): string | undefined => {
  if (!value || typeof value !== "object" || !("message" in value)) {
    return undefined;
  }

  const { message } = value as { message?: unknown };

  return typeof message === "string" ? message : undefined;
};

const getResponseBody = (value: unknown): unknown => {
  if (!value || typeof value !== "object" || !("data" in value)) {
    return undefined;
  }

  return (value as { data?: unknown }).data;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onSuccess: (data) => {
      const message = getMessage(getResponseBody(data));

      if (message) {
        toast.success(message);
      }
    },
    onError: (error) => {
      if (!axios.isAxiosError(error)) {
        return;
      }

      const message = getMessage(error.response?.data);

      if (message) {
        toast.error(message);
      }
    },
  }),
});
