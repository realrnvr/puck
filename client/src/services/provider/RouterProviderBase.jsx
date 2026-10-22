import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { GoogleOAuthProviderBase } from "./GoogleOAuthProviderBase";
import { lazy, Suspense } from "react";
import { mangaLoader } from "../../routes/loaders";

import Home from "../../pages/home/Home";
const LazyAccount = lazy(() => import("../../pages/account/Account"));
// import Account from "../../pages/account/Account";
import Template from "../../utils/template/Template";
const LazyLogin = lazy(() => import("../../components/auth/login/Login"));
// import Login from "../../components/auth/login/Login";
const LazySignup = lazy(() => import("../../components/auth/signup/Signup"));
// import Signup from "../../components/auth/signup/Signup";
import Verification from "../../pages/auth/verification/Verification";
import Verified from "../../pages/auth/verified/Verified";
import ForgotPassword from "../../pages/auth/forgotPassword/ForgotPassword";
import ResetPassword from "../../pages/auth/resetPassword/ResetPassword";
import PasswordVerification from "../../pages/auth/passwordVerification/PasswordVerification";
import PasswordVerified from "../../pages/auth/passwordVerified/PasswordVerified";
import Redirect from "../../pages/auth/redirect/Redirect";
import LoginTwo from "../../components/auth/loginTwo/LoginTwo";
import LoginGoogleAuth from "../../components/auth/loginGoogleAuth/LoginGoogleAuth";
const LazyRead = lazy(() => import("../../pages/read/Read"));
// import Read from "../../pages/read/Read";
import Layout from "../../pages/layout/Layout";
const LazyManga = lazy(() => import("../../pages/manga/Manga"));
// import Manga from "../../pages/manga/Manga";
import Mangas from "../../pages/mangas/Mangas";
const LazyViewer = lazy(() => import("../../pages/viewer/Viewer"));
// import Viewer from "../../pages/viewer/Viewer";
const LazyFavourite = lazy(() => import("../../pages/favourite/Favourite"));
// import Favourite from "../../pages/favourite/Favourite";
const LazyAccountSetting = lazy(
  () => import("../../pages/accountSetting/AccountSetting"),
);
// import AccountSetting from "../../pages/accountSetting/AccountSetting";
const LazyChangePassword = lazy(
  () => import("../../pages/changePassword/ChangePassword"),
);
// import ChangePassword from "../../pages/changePassword/ChangePassword";
import RestrictAccountSection from "../auth/RestrictAccountSection";
import ProcessGuard from "../auth/ProcessGuard";
import AuthRedirectGuard from "../auth/AuthRedirectGuard";
import RestrictFavourite from "../auth/RestrictFavourite";
const LazyAbout = lazy(() => import("../../pages/about/About"));
// import About from "../../pages/about/About";
import Community from "../../pages/community/Community";
import Watch from "../../pages/watch/Watch";
import MainPageTemplate from "../../utils/mainPageTemplate/MainPageTemplate";
import Error from "../../pages/error/Error";
import ReadSkeleton from "../../utils/skeletons/read/ReadSkeleton";
import AboutSkeleton from "../../utils/skeletons/about/AboutSkeleton";
import LoginSkeleton from "../../utils/skeletons/login/LoginSkeleton";
import SignupSkeleton from "../../utils/skeletons/signup/SignupSkeleton";
import AccountSkeleton from "../../utils/skeletons/account/AccountSkeleton";
import AccountSettingSkeleton from "../../utils/skeletons/accountSettingSkeleton/AccountSettingSkeleton";
import ChangePasswordSkeleton from "../../utils/skeletons/changePassword/ChangePasswordSkeleton";
import FavouriteSkeleton from "../../utils/skeletons/favourite/FavouriteSkeleton";
import MangaSkeleton from "../../utils/skeletons/manga/MangaSkeleton";
import ViewerSkeleton from "../../utils/skeletons/viewer/ViewerSkeleton";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/read",
        element: (
          <MainPageTemplate
            img={"/pattern.svg"}
            title={"READ"}
            description={
              "Step into a world where ink meets magic. Each page is a portal, each panel a universe waiting to be discovered. Ready to turn the page? Your adventure starts now!"
            }
          >
            <Suspense fallback={<ReadSkeleton />}>
              <LazyRead />
            </Suspense>
          </MainPageTemplate>
        ),
      },
      {
        path: "/about",
        element: (
          <MainPageTemplate
            img={"/pattern-4.svg"}
            title={"About"}
            description={
              "Your gateway to discovering and enjoying the best of manga and anime. Explore timeless classics, discover new favorites, and immerse yourself in the stories you love—all in one place."
            }
          >
            <Suspense fallback={<AboutSkeleton />}>
              <LazyAbout />
            </Suspense>
          </MainPageTemplate>
        ),
      },
      {
        path: "/community",
        element: (
          <MainPageTemplate
            img={"/pattern-6.svg"}
            title={"Community"}
            description={
              " Connect with fellow manga and anime enthusiasts! Share your thoughts, discuss favorites, and discover recommendations in a vibrant and welcoming space."
            }
            titleClassName={"main-page__title--fs"}
          >
            <Community />
          </MainPageTemplate>
        ),
      },
      {
        path: "/watch",
        element: (
          <MainPageTemplate
            img={"/pattern-5.svg"}
            title={"Watch"}
            description={
              " From action-packed adventures to heartwarming tales, explore a diverse collection of anime and watch it all in one place."
            }
          >
            <Watch />
          </MainPageTemplate>
        ),
      },
      {
        path: "/manga/:mangaId/:authorId",
        element: (
          <Suspense fallback={<MangaSkeleton />}>
            <LazyManga />
          </Suspense>
        ),
        loader: mangaLoader,
      },
      {
        path: "/mangas",
        element: <Mangas />,
      },
      {
        path: "/favourite",
        element: (
          <RestrictFavourite>
            <Suspense fallback={<FavouriteSkeleton />}>
              <LazyFavourite />
            </Suspense>
          </RestrictFavourite>
        ),
      },
      {
        path: "/account",
        element: (
          <RestrictAccountSection type="account">
            <Suspense fallback={<AccountSkeleton />}>
              <LazyAccount />
            </Suspense>
          </RestrictAccountSection>
        ),
      },
      {
        path: "/account-setting",
        element: (
          <RestrictAccountSection type="accountSetting">
            <Suspense fallback={<AccountSettingSkeleton />}>
              <LazyAccountSetting />
            </Suspense>
          </RestrictAccountSection>
        ),
      },
      {
        path: "/change-password",
        element: (
          <RestrictAccountSection type="changePassword">
            <Suspense fallback={<ChangePasswordSkeleton />}>
              <LazyChangePassword />
            </Suspense>
          </RestrictAccountSection>
        ),
      },
    ],
  },
  {
    path: "/viewer/:mangaId",
    element: (
      <Suspense fallback={<ViewerSkeleton />}>
        <LazyViewer />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <GoogleOAuthProviderBase>
        <AuthRedirectGuard>
          <Template template="login">
            <Suspense fallback={<LoginSkeleton />}>
              <LazyLogin />
            </Suspense>
          </Template>
        </AuthRedirectGuard>
      </GoogleOAuthProviderBase>
    ),
  },
  {
    path: "/login/loginTwo",
    element: (
      <ProcessGuard value={"log-mail"} to={"/login"}>
        <LoginTwo />
      </ProcessGuard>
    ),
  },
  {
    path: "/login/loginGoogleAuth",
    element: (
      <ProcessGuard value={"log-mail"} to={"/login"}>
        <LoginGoogleAuth />
      </ProcessGuard>
    ),
  },
  {
    path: "/signup",
    element: (
      <GoogleOAuthProviderBase>
        <AuthRedirectGuard>
          <Template template="signup">
            <Suspense fallback={<SignupSkeleton />}>
              <LazySignup />
            </Suspense>
          </Template>
        </AuthRedirectGuard>
      </GoogleOAuthProviderBase>
    ),
  },
  {
    path: "/verification",
    element: (
      <ProcessGuard value={"sign-mail"} to={"/login"}>
        <Verification />
      </ProcessGuard>
    ),
  },
  {
    path: "/verified/:verificationId",
    element: (
      <ProcessGuard value={"sign-mail"} to={"/login"}>
        <Verified />
      </ProcessGuard>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <ProcessGuard value={"log-mail"} to={"/login"}>
        <ForgotPassword />
      </ProcessGuard>
    ),
  },
  {
    path: "/reset-password/:verificationId",
    element: (
      <ProcessGuard value={"pass-mail"} to={"/forgot-password"}>
        <ResetPassword />
      </ProcessGuard>
    ),
  },
  {
    path: "/password-verification",
    element: (
      <ProcessGuard value={"pass-mail"} to={"/forgot-password"}>
        <PasswordVerification />
      </ProcessGuard>
    ),
  },
  {
    path: "/password-verified",
    element: (
      <ProcessGuard value={"pass-mail"} to={"/login/loginTwo"}>
        <PasswordVerified />
      </ProcessGuard>
    ),
  },
  { path: "/redirect", element: <Redirect /> },
  {
    path: "*",
    element: <Error />,
  },
]);

export const RouterProviderBase = () => {
  return <RouterProvider router={router} />;
};
