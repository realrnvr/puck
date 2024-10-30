import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const GoogleOAuthProviderBase = ({ children }) => {
  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID}
    >
      {children}
    </GoogleOAuthProvider>
  );
};
