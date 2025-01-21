import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { GoogleOAuthProviderBase } from "./GoogleOAuthProviderBase";

import Home from "../../pages/home/Home";
import Account from "../../pages/account/Account";
import Template from "../../utils/template/Template";
import Login from "../../components/auth/login/Login";
import Signup from "../../components/auth/signup/Signup";
import Verification from "../../pages/auth/verification/Verification";
import Verified from "../../pages/auth/verified/Verified";
import ForgotPassword from "../../pages/auth/forgotPassword/ForgotPassword";
import ResetPassword from "../../pages/auth/resetPassword/ResetPassword";
import PasswordVerification from "../../pages/auth/passwordVerification/PasswordVerification";
import PasswordVerified from "../../pages/auth/passwordVerified/PasswordVerified";
import Redirect from "../../pages/auth/redirect/Redirect";
import LoginTwo from "../../components/auth/loginTwo/LoginTwo";
import LoginGoogleAuth from "../../components/auth/loginGoogleAuth/LoginGoogleAuth";
import Read from "../../pages/read/Read";
import Layout from "../../pages/layout/Layout";
import Manga from "../../pages/manga/Manga";
import Mangas from "../../pages/mangas/Mangas";
import Viewer from "../../pages/viewer/Viewer";
import Favourite from "../../pages/favourite/Favourite";
import Test from "../../tests/Test";
import AccountSetting from "../../pages/accountSetting/AccountSetting";
import ChangePassword from "../../pages/changePassword/ChangePassword";
import RestrictAccountSection from "../auth/RestrictAccountSection";
import ProcessGaurd from "../auth/ProcessGaurd";
import AuthRedirectGaurd from "../auth/AuthRedirectGaurd";
import RestrictFavourite from "../auth/RestrictFavourite";
import About from "../../pages/about/About";
import Community from "../../pages/community/Community";
import Watch from "../../pages/watch/Watch";
import MainPageTemplate from "../../utils/mainPageTemplate/MainPageTemplate";

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
            <Read />
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
            <About />
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
        element: <Manga />,
      },
      {
        path: "/mangas",
        element: <Mangas />,
      },
      {
        path: "/favourite",
        element: (
          <RestrictFavourite>
            <Favourite />
          </RestrictFavourite>
        ),
      },
      {
        path: "/account",
        element: (
          <RestrictAccountSection>
            <Account />
          </RestrictAccountSection>
        ),
      },
      {
        path: "/account-setting",
        element: (
          <RestrictAccountSection>
            <AccountSetting />
          </RestrictAccountSection>
        ),
      },
      {
        path: "/change-password",
        element: (
          <RestrictAccountSection>
            <ChangePassword />
          </RestrictAccountSection>
        ),
      },
    ],
  },
  {
    path: "/viewer/:mangaId",
    element: <Viewer />,
  },
  {
    path: "/test",
    element: <Test />,
  },
  {
    path: "/login",
    element: (
      <GoogleOAuthProviderBase>
        <AuthRedirectGaurd>
          <Template template="login">
            <Login />
          </Template>
        </AuthRedirectGaurd>
      </GoogleOAuthProviderBase>
    ),
  },
  {
    path: "/login/loginTwo",
    element: (
      <ProcessGaurd value={"log-mail"} to={"/login"}>
        <LoginTwo />
      </ProcessGaurd>
    ),
  },
  {
    path: "/login/loginGoogleAuth",
    element: (
      <ProcessGaurd value={"log-mail"} to={"/login"}>
        <LoginGoogleAuth />
      </ProcessGaurd>
    ),
  },
  {
    path: "/signup",
    element: (
      <GoogleOAuthProviderBase>
        <AuthRedirectGaurd>
          <Template template="signup">
            <Signup />
          </Template>
        </AuthRedirectGaurd>
      </GoogleOAuthProviderBase>
    ),
  },
  {
    path: "/verification",
    element: (
      <ProcessGaurd value={"sign-mail"} to={"/login"}>
        <Verification />
      </ProcessGaurd>
    ),
  },
  {
    path: "/verified/:verificationId",
    element: (
      <ProcessGaurd value={"sign-mail"} to={"/login"}>
        <Verified />
      </ProcessGaurd>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <ProcessGaurd value={"log-mail"} to={"/login"}>
        <ForgotPassword />
      </ProcessGaurd>
    ),
  },
  {
    path: "/reset-password/:verificationId",
    element: (
      <ProcessGaurd value={"pass-mail"} to={"/forgot-password"}>
        <ResetPassword />
      </ProcessGaurd>
    ),
  },
  {
    path: "/password-verification",
    element: (
      <ProcessGaurd value={"pass-mail"} to={"/forgot-password"}>
        <PasswordVerification />
      </ProcessGaurd>
    ),
  },
  {
    path: "/password-verified",
    element: (
      <ProcessGaurd value={"pass-mail"} to={"/login/loginTwo"}>
        <PasswordVerified />
      </ProcessGaurd>
    ),
  },
  { path: "/redirect", element: <Redirect /> },
]);

export const RouterProviderBase = () => {
  return <RouterProvider router={router} />;
};
