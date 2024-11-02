import { jwtDecode } from "jwt-decode";

export const isExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return exp <= Math.floor(Date.now() / 1000);
  } catch {
    return true;
  }
};
