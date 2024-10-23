import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../services/mutation/authMutation";

export function useResetPasswordMutation(options = {}) {
  return useMutation({
    mutationFn: resetPassword,
    ...options,
  });
}
