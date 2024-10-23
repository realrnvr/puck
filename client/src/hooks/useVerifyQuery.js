import { useQuery } from "@tanstack/react-query";
import { verify } from "../services/query/authQuery";

export function useVerifyQuery(verificationId) {
  return useQuery({
    queryKey: ["verification-id", { verificationId }],
    queryFn: () => verify(verificationId),
    retry: 0,
    staleTime: Infinity,
  });
}
