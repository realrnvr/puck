import type { AxiosResponse } from "axios";
import type {
  AuthResponse,
  EmailInput,
  LoginInput,
  PasswordConfirmationInput,
  ResetPasswordInput,
  SignupInput,
} from "../../types/auth";
import type { MessageResponse } from "../../types/api";
import { axiosInstance } from "../api/axios";

export const verify = ({
  verificationId,
  data,
}: {
  verificationId: string;
  data: unknown;
}): Promise<AxiosResponse<AuthResponse>> => {
  return axiosInstance.post(
    `/api/v1/auth/verification/${verificationId}`,
    data,
  );
};

export const loginAuthOne = (
  data: EmailInput,
): Promise<AxiosResponse<AuthResponse>> => {
  return axiosInstance.post("/api/v1/auth/loginAuthOne", data);
};

export const loginAuthTwo = (
  data: LoginInput,
): Promise<AxiosResponse<AuthResponse>> => {
  return axiosInstance.post("/api/v1/auth/loginAuthTwo", data);
};

export const loginGoogleAuthTwo = (
  data: PasswordConfirmationInput,
): Promise<AxiosResponse<AuthResponse>> => {
  return axiosInstance.post("/api/v1/auth/loginGoogleAuthTwo", data);
};

export const signup = (
  data: SignupInput,
): Promise<AxiosResponse<AuthResponse>> => {
  return axiosInstance.post("/api/v1/auth/signup", data);
};

export const reverification = (
  email: string,
): Promise<AxiosResponse<MessageResponse>> => {
  return axiosInstance.post("/api/v1/auth/resendVerification", { email });
};

export const forgotPassword = (
  data: EmailInput,
): Promise<AxiosResponse<MessageResponse>> => {
  return axiosInstance.post("/api/v1/auth/forgotPassword", data);
};

export const resetPassword = ({
  verificationId,
  data,
}: {
  verificationId: string;
  data: ResetPasswordInput;
}): Promise<AxiosResponse<MessageResponse>> => {
  return axiosInstance.post(
    `/api/v1/auth/resetPassword/${verificationId}`,
    data,
  );
};

export const resendPasswordVerification = (
  email: string,
): Promise<AxiosResponse<MessageResponse>> => {
  return axiosInstance.post("/api/v1/auth/resendPasswordVerification", {
    email,
  });
};
