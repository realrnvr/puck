import { axiosInstance } from "../api/axios";

export const verify = ({ verificationId, data }) => {
  return axiosInstance.post(
    `/api/v1/auth/verification/${verificationId}`,
    data
  );
};

export const loginAuthOne = (data) => {
  return axiosInstance.post("/api/v1/auth/loginAuthOne", data);
};

export const loginAuthTwo = (data) => {
  return axiosInstance.post("/api/v1/auth/loginAuthTwo", data);
};

export const loginGoogleAuthTwo = (data) => {
  return axiosInstance.post("/api/v1/auth/loginGoogleAuthTwo", data);
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
