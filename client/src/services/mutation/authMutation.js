import { axiosInstance } from "../api/axios";

export const login = (data) => {
  return axiosInstance.post("/api/v1/auth/login", data);
};

export const signup = (data) => {
  return axiosInstance.post("/api/v1/auth/signup", data);
};

export const reverification = (email) => {
  return axiosInstance.post("/api/v1/auth/resendVerification", { email });
};

export const forgotPassword = (data) => {
  return axiosInstance.post("/api/v1/auth/forgotPassword", data);
};

export const resetPassword = ({ verificationId, data }) => {
  return axiosInstance.post(
    `/api/v1/auth/resetPassword/${verificationId}`,
    data
  );
};

export const resendPasswordVerification = (email) => {
  return axiosInstance.post("/api/v1/auth/resendPasswordVerification", {
    email,
  });
};
