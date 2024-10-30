import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./services/provider/AuthProvider";
import { QueryClientProviderBase } from "./services/provider/QueryClientProviderBase";
import { RouterProviderBase } from "./services/provider/RouterProviderBase";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GoogleOAuthProviderBase } from "./services/provider/GoogleOAuthProviderBase";
import Notification from "./utils/toaster/Notification";

import "./resets.css";
import "./utils.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProviderBase>
      <GoogleOAuthProviderBase>
        <AuthProvider>
          <RouterProviderBase />
          <Notification />
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </GoogleOAuthProviderBase>
    </QueryClientProviderBase>
  </StrictMode>
);
