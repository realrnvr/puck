import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../services/api/axios";
import toast from "react-hot-toast";

export const useRedirect = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const isMutating = useRef(false);

  const { mutate: googleMutate } = useMutation({
    mutationFn: (code) => axiosInstance.post("/api/v1/auth/google", { code }),
    onSuccess: (data) => {
      auth.setToken(data.data?.accessToken);
      toast.success("hello :)");
      navigate("/account");
      isMutating.current = false;
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
      navigate("/login");
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
