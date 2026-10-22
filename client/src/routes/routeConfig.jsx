import { authRoutes } from "./auth.routes";
import { layoutRoute } from "./layout.routes";
import { redirectRoute, viewerRoute, wildcardRoute } from "./standalone.routes";

export const routeConfig = [
  layoutRoute,
  viewerRoute,
  ...authRoutes,
  redirectRoute,
  wildcardRoute,
];
