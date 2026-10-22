import { useEffect, useLayoutEffect, useState } from "react";
import { axiosInstance } from "../api/axios.js";
import { AuthContext } from "../../hooks/useAuth.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(undefined);
  const [isPending, setIsPending] = useState(true);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: () => axiosInstance.get("/api/v1/client/user"),
    enabled: !!token,
  });

  const { mutate: logoutMutate, isPending: mutateLogoutPending } = useMutation({
    mutationFn: () => axiosInstance.post("/api/v1/auth/logout"),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      toast.success("logged out!");
      setToken(null);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await axiosInstance.post("/api/v1/auth/me");

        if (response.data?.isAuthenticated && response.data.accessToken) {
          setToken(response.data.accessToken);
        } else {
          setToken(null);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
        setToken(null);
      } finally {
        setIsPending(false);
      }
    };

    fetchMe();
  }, []);

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
        const isRefreshRequest =
          originalRequest?.url?.includes("/api/v1/auth/refreshToken") ||
          originalRequest?.url?.includes("/api/v1/auth/me");
        const hadAccessToken = Boolean(originalRequest?.headers?.Authorization);

        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry &&
          !isRefreshRequest &&
          hadAccessToken
        ) {
          originalRequest._retry = true;

          try {
            const refreshResponse = await axiosInstance.get(
              "/api/v1/auth/refreshToken",
            );
            const nextAccessToken = refreshResponse.data.accessToken;

            setToken(nextAccessToken);
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;

            return axiosInstance(originalRequest);
          } catch (refreshError) {
            queryClient.removeQueries({ queryKey: ["user"] });
            setToken(null);
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosInstance.interceptors.response.eject(refreshInterceptor);
    };
  }, [queryClient]);

  AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        user: data?.data,
        userError: isError,
        logout: logoutMutate,
        isPending: isLoading,
        mutateTokenPending: isPending,
        mutateLogoutPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
