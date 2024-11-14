import { GoogleOAuthProvider } from "@react-oauth/google";
import PropTypes from "prop-types";

export const GoogleOAuthProviderBase = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
};

GoogleOAuthProviderBase.propTypes = {
  children: PropTypes.node.isRequired,
};
