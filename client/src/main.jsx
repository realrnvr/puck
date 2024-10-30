import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./services/provider/AuthProvider";
import { QueryClientProviderBase } from "./services/provider/QueryClientProviderBase";
import { RouterProviderBase } from "./services/provider/RouterProviderBase";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./resets.css";
import "./utils.css";
import "./index.css";
import Notification from "./utils/toaster/Notification";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <QueryClientProviderBase>
        <AuthProvider>
          <RouterProviderBase />
          <Notification />
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </QueryClientProviderBase>
    </GoogleOAuthProvider>
  </StrictMode>
);
