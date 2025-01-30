import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./services/provider/AuthProvider";
import { QueryClientProviderBase } from "./services/provider/QueryClient/QueryClientProviderBase";
import { RouterProviderBase } from "./services/provider/RouterProviderBase";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Notification from "./utils/notification/Notification";

import "./resets.css";
import "./utils.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProviderBase>
      <AuthProvider>
        <RouterProviderBase />
        <Notification />
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthProvider>
    </QueryClientProviderBase>
  </StrictMode>
);
