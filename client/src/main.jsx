/**
 * Copyright 2025 realrnvr
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
