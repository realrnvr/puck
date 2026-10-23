import { QueryCache, QueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onSuccess: (data) => {
      if (data?.data?.message) {
        toast.success(data.data.message);
      }
    },
    onError: (error) => {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    },
  }),
});
