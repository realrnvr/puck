import type { Dispatch, SetStateAction } from "react";

export interface AuthUser {
  id?: string;
  username?: string | null;
  email?: string | null;
  type?: string | null;
  isVerified?: boolean;
}

export interface AuthContextValue {
  token: string | null | undefined;
  setToken: Dispatch<SetStateAction<string | null | undefined>>;
  user?: AuthUser;
  userError?: boolean;
  logout: () => void;
  isPending?: boolean;
  mutateTokenPending?: boolean;
  mutateLogoutPending?: boolean;
}

export interface EmailInput {
  email: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  username: string;
  email: string;
  password: string;
}

export interface PasswordConfirmationInput {
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordInput {
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user?: AuthUser | null;
  accessToken?: string;
  navigate?: string;
  message?: string;
  type?: string;
  email?: string;
}
