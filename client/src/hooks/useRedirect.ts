import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../services/api/axios";
import toast from "react-hot-toast";
import { getErrorMessage } from "../helper/getErrorMessage";

export const useRedirect = (): void => {
  const auth = useAuth();
  const navigate = useNavigate();

  const isMutating = useRef(false);

  const { mutate: googleMutate } = useMutation({
    mutationFn: (code: string) =>
      axiosInstance.post<{ accessToken?: string }>("/api/v1/auth/google", {
        code,
      }),
    onSuccess: (data) => {
      auth.setToken(data.data?.accessToken);
      toast.success("hello :)");
      navigate("/account", { replace: true });
      isMutating.current = false;
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Something went wrong");

      if (message) {
        toast.error(message);
      }
      navigate("/login", { replace: true });
      isMutating.current = false;
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code && !isMutating.current) {
      isMutating.current = true;
      googleMutate(code);
    } else if (!code) {
      navigate("/login");
    }
  }, [navigate, googleMutate]);
};
