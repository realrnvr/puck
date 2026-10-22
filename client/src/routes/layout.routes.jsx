import Layout from "../pages/layout/Layout";
import { protectedRoutes } from "./protected.routes";
import { publicRoutes } from "./public.routes";

export const layoutRoute = {
  path: "/",
  element: <Layout />,
  children: [...publicRoutes, ...protectedRoutes],
};
