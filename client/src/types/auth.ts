import type { Dispatch, SetStateAction } from "react";

export interface AuthUser {
  username: string;
  email: string;
  type: string;
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
