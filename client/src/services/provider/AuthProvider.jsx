import { useEffect, useLayoutEffect, useState } from "react";
import { axiosInstance } from "../api/axios.js";
import { AuthContext } from "../../hooks/useAuth.js";
import { useLocalStorage } from "../../hooks/useLocalStorage.js";
import PropTypes from "prop-types";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useLocalStorage("token", undefined);
  const [isLoading, setIsLoading] = useState(false);
  console.log("token state", token);

  useEffect(() => {
    const fetchMe = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post("/api/v1/auth/me");
        setToken(response.data.accessToken);
      } catch (error) {
        setToken(null);
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, [setToken]);

  useLayoutEffect(() => {
    const authInterceptor = axiosInstance.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;
      return config;
    });

    return () => {
      axiosInstance.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const refreshInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 403 &&
          error.response.data.message === "Forbidden" &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            const response = await axiosInstance.get(
              "/api/v1/auth/refreshToken"
            );
            setToken(response.data.accessToken);

            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            setToken(null);
            console.error("Refresh token failed:", refreshError);
            return Promise.reject(refreshError);
          }
        }

        console.error("API request failed:", error);
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(refreshInterceptor);
    };
  }, [setToken]);

  AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <AuthContext.Provider value={{ token, setToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
