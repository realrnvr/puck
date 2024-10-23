import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../services/mutation/authMutation";
import { toast } from "react-hot-toast";

export function useForgotPasswordMutation(options = {}) {
  return useMutation({
    mutationFn: forgotPassword,
    onMutate: () => {
      toast.loading("Sending verification email...", {
        id: "verification-toast",
      });
    },
    ...options,
    onSettled: () => {
      toast.dismiss("verification-toast");
    },
  });
}
