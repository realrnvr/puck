import "./redirect.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { axiosInstance } from "../../../services/api/axios";
import Loader from "../../../components/ui/loader/Loader";

const Redirect = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    console.log("Authorization code:", code);

    if (code) {
      handleGoogleLogin(code);
    } else {
      console.error("No authorization code found in the URL.");
      navigate("/login");
    }
  }, [navigate]);

  const handleGoogleLogin = async (code) => {
    try {
      const response = await axiosInstance.post(
        "http://localhost:3000/api/v1/auth/google",
        {
          code,
        }
      );
      console.log("Response from backend:", response.data);
      const { accessToken } = response.data;
      auth.setToken(accessToken);
      navigate("/account");
    } catch (error) {
      console.error("Error during Google login:", error);
      navigate("/login");
    }
  };

  return (
    <div className="redirect">
      <Loader />
    </div>
  );
};

export default Redirect;
