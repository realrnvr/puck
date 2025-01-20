import { useEffect, useLayoutEffect } from "react";
import { axiosInstance } from "../api/axios.js";
import { AuthContext } from "../../hooks/useAuth.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "../../hooks/useLocalStorage.js";
import PropTypes from "prop-types";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useLocalStorage("token", undefined);
  // const [isTokenLoading, setIsTokenLoading] = useState(false);
  const queryClient = useQueryClient();
  console.log("token state", token);

  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => axiosInstance.get("/api/v1/client/user"),
    enabled: !!token,
  });

  const { mutate: logoutMutate, isPending: mutateLogoutPending } = useMutation({
    mutationFn: () => axiosInstance.post("/api/v1/auth/logout"),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      setToken(null);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate, isPending: mutateTokenPending } = useMutation({
    mutationFn: () => axiosInstance.post("/api/v1/auth/me"),
    onSuccess: (data) => {
      setToken(data.data.accessToken);
    },
    onError: (error) => {
      setToken(null);
      console.error("Error fetching user data:", error);
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

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
  }, []);

  AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        user: data?.data,
        logout: logoutMutate,
        isPending: isLoading,
        mutateTokenPending,
        mutateLogoutPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
