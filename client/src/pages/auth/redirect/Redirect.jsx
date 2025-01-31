import "./redirect.css";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { axiosInstance } from "../../../services/api/axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Loader from "../../../components/ui/loader/Loader";

const Redirect = () => {
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

  return (
    <div className="redirect">
      <Loader />
    </div>
  );
};

export default Redirect;
