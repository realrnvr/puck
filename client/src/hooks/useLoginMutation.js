import { useMutation } from "@tanstack/react-query";
import { login } from "../services/mutation/authMutation";

export function useLoginMutation(options = {}) {
  return useMutation({
    mutationFn: login,
    ...options,
  });
}
