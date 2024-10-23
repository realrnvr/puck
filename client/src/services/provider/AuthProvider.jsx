import { useLayoutEffect, useState } from "react";
import { axiosInstance } from "../api/axios.js";
import { AuthContext } from "../../hooks/useAuth.js";
import { useMutation } from "@tanstack/react-query";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState();
  console.log("token state", token);

  const { mutateAsync } = useMutation({
    mutationFn: () => axiosInstance.get("/api/v1/auth/refreshToken"),
    onSuccess: (data) => {
      console.log("refresh");
      setToken(data?.data?.accessToken);
    },
    onError: (error) => {
      console.error("Error refreshing access token:", error);
      setToken(null);
      throw error;
    },
  });

  const refreshAccessToken = async () => {
    await mutateAsync();
  };

  useLayoutEffect(() => {
    const authInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
      }
    );

    return () => axiosInstance.interceptors.request.eject(authInterceptor);
  }, [token]);

  useLayoutEffect(() => {
    const refreshInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newToken = await refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            console.error("Failed to refresh token:", refreshError);
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => axiosInstance.interceptors.response.eject(refreshInterceptor);
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
