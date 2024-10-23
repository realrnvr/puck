import { useMutation } from "@tanstack/react-query";
import { signup } from "../services/mutation/authMutation";

export function useSignupMutation(options = {}) {
  return useMutation({
    mutationFn: signup,
    ...options,
  });
}
