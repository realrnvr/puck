import { useMutation } from "@tanstack/react-query";
import { reverification } from "../services/mutation/authMutation";
import toast from "react-hot-toast";

export function useReverificationMutation() {
  return useMutation({
    mutationFn: reverification,
    onMutate: () => {
      toast.loading("Sending verification email...", {
        id: "verification-toast",
      });
    },
    onSuccess: (data) => {
      if (data?.data?.message) {
        toast.success(data.data.message, {
          id: "verification-toast",
        });
      }
    },
    onError: (error) => {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message, {
          id: "verification-toast",
        });
      }
    },
  });
}
