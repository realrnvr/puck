import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  exp?: number;
}

export const isExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<TokenPayload>(token);
    return exp !== undefined && exp <= Math.floor(Date.now() / 1000);
  } catch {
    return true;
  }
};
