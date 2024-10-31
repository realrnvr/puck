import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "../../pages/home/Home";
import Account from "../../pages/account/Account";
import ProtectedRoute from "../auth/ProtectedRoute";
import Login from "../../components/auth/login/Login";
import Signup from "../../components/auth/signup/Signup";
import Verification from "../../pages/auth/verification/Verification";
import Verified from "../../pages/auth/verified/Verified";
import Template from "../../utils/template/Template";
import VerificationGaurd from "../auth/VerificationGaurd";
import ForgotPassword from "../../pages/auth/forgotPassword/ForgotPassword";
import ResetPassword from "../../pages/auth/resetPassword/ResetPassword";
import PasswordVerification from "../../pages/auth/passwordVerification/PasswordVerification";
import PasswordVerified from "../../pages/auth/passwordVerified/PasswordVerified";
import Redirect from "../../pages/auth/redirect/Redirect";
import LoginTwo from "../../components/auth/loginTwo/LoginTwo";
import LoginGoogleAuth from "../../components/auth/loginGoogleAuth/LoginGoogleAuth";
import LoginGaurd from "../auth/LoginGaurd";
import PasswordVerifiedGaurd from "../auth/passwordVerifiedGaurd";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
    path: "/login",
    element: (
      <Template template="login">
        <Login />
      </Template>
    ),
  },
  {
    path: "/signup",
    element: (
      <Template template="signup">
        <Signup />
      </Template>
    ),
  },
  {
    path: "/verification",
    element: (
      <VerificationGaurd value={"sign-mail"}>
        <Verification />
      </VerificationGaurd>
    ),
  },
  {
    path: "/verified/:verificationId",
    element: (
      <VerificationGaurd value={"sign-mail"}>
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
      <VerificationGaurd value={"pass-mail"}>
        <ResetPassword />
      </VerificationGaurd>
    ),
  },
  {
    path: "/password-verification",
    element: (
      <VerificationGaurd value={"pass-mail"}>
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
  {
    path: "/redirect",
    element: <Redirect />,
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
]);

export const RouterProviderBase = () => {
  return <RouterProvider router={router} />;
};
