import { useMutation } from "@tanstack/react-query";
import { resendPasswordVerification } from "../services/mutation/authMutation";

export function useResendPasswordVerificationMutation(options = {}) {
  return useMutation({
    mutationFn: resendPasswordVerification,
    ...options,
  });
}
