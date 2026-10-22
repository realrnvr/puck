import Redirect from "../pages/auth/redirect/Redirect";
import ErrorPage from "../pages/error/Error";
import ViewerSkeleton from "../utils/skeletons/viewer/ViewerSkeleton";
import { LazyViewer } from "./lazyPages";
import { LazyRouteElement } from "./lazyRouteElement";

export const viewerRoute = {
  path: "/viewer/:mangaId",
  element: (
    <LazyRouteElement component={LazyViewer} fallback={<ViewerSkeleton />} />
  ),
};

export const redirectRoute = {
  path: "/redirect",
  element: <Redirect />,
};

export const wildcardRoute = {
  path: "*",
  element: <ErrorPage />,
};
