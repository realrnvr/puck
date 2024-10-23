import { useMutation } from "@tanstack/react-query";
import { resendPasswordVerification } from "../services/mutation/authMutation";

export function useResendPasswordVerificationMutation() {
  return useMutation({
    mutationFn: resendPasswordVerification,
  });
}
