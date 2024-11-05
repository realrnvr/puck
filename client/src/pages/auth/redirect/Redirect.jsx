import "./redirect.css";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { axiosInstance } from "../../../services/api/axios";
import Loader from "../../../components/ui/loader/Loader";
import { useMutation } from "@tanstack/react-query";

const Redirect = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const isMutating = useRef(false);

  const { mutate: googleMutate } = useMutation({
    mutationFn: (code) => axiosInstance.post("/api/v1/auth/google", { code }),
    onSuccess: (data) => {
      console.log("Response from backend:", data.data);
      auth.setToken(data.data?.accessToken);
      navigate("/account");
      isMutating.current = false;
    },
    onError: (error) => {
      console.error("Error during Google login:", error);
      navigate("/login");
      isMutating.current = false;
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    console.log("Authorization code:", code);

    if (code && !isMutating.current) {
      isMutating.current = true;
      googleMutate(code);
    } else if (!code) {
      console.error("No authorization code found in the URL.");
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
