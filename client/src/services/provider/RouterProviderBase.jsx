import { RouterProvider } from "react-router-dom";
import { router } from "../../routes/router";

export const RouterProviderBase = () => {
  return <RouterProvider router={router} />;
};
