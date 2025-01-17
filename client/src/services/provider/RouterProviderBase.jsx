import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { GoogleOAuthProviderBase } from "./GoogleOAuthProviderBase";

import Home from "../../pages/home/Home";
import ProtectedRoute from "../auth/ProtectedRoute";
import Account from "../../pages/account/Account";
import Template from "../../utils/template/Template";
import Login from "../../components/auth/login/Login";
import Signup from "../../components/auth/signup/Signup";
import VerificationGaurd from "../auth/VerificationGaurd";
import Verification from "../../pages/auth/verification/Verification";
import Verified from "../../pages/auth/verified/Verified";
import LoginGaurd from "../auth/LoginGaurd";
import ForgotPassword from "../../pages/auth/forgotPassword/ForgotPassword";
import ResetPassword from "../../pages/auth/resetPassword/ResetPassword";
import PasswordVerification from "../../pages/auth/passwordVerification/PasswordVerification";
import PasswordVerifiedGaurd from "../auth/PasswordVerifiedGaurd";
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
        element: <Read />,
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
        element: <Favourite />,
      },
      {
        path: "/account",
        element: (
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        ),
      },
      {
        path: "/account-setting",
        element: <AccountSetting />,
      },
      {
        path: "/change-password",
        element: <ChangePassword />,
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
        <Template template="login">
          <Login />
        </Template>
      </GoogleOAuthProviderBase>
    ),
  },
  {
    path: "/login/loginTwo",
    element: (
      <LoginGaurd>
        <LoginTwo />
      </LoginGaurd>
    ),
  },
  {
    path: "/login/loginGoogleAuth",
    element: (
      <LoginGaurd>
        <LoginGoogleAuth />
      </LoginGaurd>
    ),
  },
  {
    path: "/signup",
    element: (
      <GoogleOAuthProviderBase>
        <Template template="signup">
          <Signup />
        </Template>
      </GoogleOAuthProviderBase>
    ),
  },
  {
    path: "/verification",
    element: (
      <VerificationGaurd value="sign-mail">
        <Verification />
      </VerificationGaurd>
    ),
  },
  {
    path: "/verified/:verificationId",
    element: (
      <VerificationGaurd value="sign-mail">
        <Verified />
      </VerificationGaurd>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <LoginGaurd>
        <ForgotPassword />
      </LoginGaurd>
    ),
  },
  {
    path: "/reset-password/:verificationId",
    element: (
      <VerificationGaurd value="pass-mail">
        <ResetPassword />
      </VerificationGaurd>
    ),
  },
  {
    path: "/password-verification",
    element: (
      <VerificationGaurd value="pass-mail">
        <PasswordVerification />
      </VerificationGaurd>
    ),
  },
  {
    path: "/password-verified",
    element: (
      <PasswordVerifiedGaurd>
        <PasswordVerified />
      </PasswordVerifiedGaurd>
    ),
  },
  { path: "/redirect", element: <Redirect /> },
]);

export const RouterProviderBase = () => {
  return <RouterProvider router={router} />;
};
