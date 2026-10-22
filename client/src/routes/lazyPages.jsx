import { lazy } from "react";

export const LazyAccount = lazy(() => import("../pages/account/Account"));
export const LazyLogin = lazy(() => import("../components/auth/login/Login"));
export const LazySignup = lazy(
  () => import("../components/auth/signup/Signup"),
);
export const LazyRead = lazy(() => import("../pages/read/Read"));
export const LazyManga = lazy(() => import("../pages/manga/Manga"));
export const LazyViewer = lazy(() => import("../pages/viewer/Viewer"));
export const LazyFavourite = lazy(() => import("../pages/favourite/Favourite"));
export const LazyAccountSetting = lazy(
  () => import("../pages/accountSetting/AccountSetting"),
);
export const LazyChangePassword = lazy(
  () => import("../pages/changePassword/ChangePassword"),
);
export const LazyAbout = lazy(() => import("../pages/about/About"));
