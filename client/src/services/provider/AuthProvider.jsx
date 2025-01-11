import { useEffect, useLayoutEffect, useState } from "react";
import { axiosInstance } from "../api/axios.js";
import { AuthContext } from "../../hooks/useAuth.js";
import PropTypes from "prop-types";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(undefined);
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
      async (response) => {
        // Handle responses with a 403 statusCode in the body
        if (
          response.data?.statusCode === 403 &&
          response.data.message === "Forbidden"
        ) {
          const originalRequest = response.config;

          if (!originalRequest._retry) {
            originalRequest._retry = true;

            try {
              const refreshResponse = await axiosInstance.get(
                "/api/v1/auth/refreshToken"
              );

              setToken(refreshResponse.data.accessToken);

              originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
              return axiosInstance(originalRequest);
            } catch (refreshError) {
              setToken(null);
              console.error("Refresh token failed:", refreshError);
              return Promise.reject(refreshError);
            }
          }

          setToken(null);
          console.error("Session expired. Please log in again.");
          return Promise.reject(response);
        }

        return response;
      },
      (error) => {
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
