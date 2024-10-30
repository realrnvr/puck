import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "../../pages/home/Home";
import Account from "../../pages/account/Account";
import ProtectedRoute from "../auth/ProtectedRoute";
import Login from "../../components/login/Login";
import Signup from "../../components/signup/Signup";
import Verification from "../../components/verification/Verification";
import Verified from "../../components/verified/Verified";
import Template from "../../utils/template/Template";
import VerificationGaurd from "../auth/VerificationGaurd";
import ForgotPassword from "../../components/forgotPassword/ForgotPassword";
import ResetPassword from "../../components/resetPassword/ResetPassword";
import PasswordVerification from "../../components/passwordVerification/PasswordVerification";
import PasswordVerified from "../../components/passwordVerified/PasswordVerified";
import Redirect from "../../pages/redirect/Redirect";
import LoginTwo from "../../components/loginTwo/LoginTwo";
import LoginGoogleAuth from "../../components/loginGoogleAuth/LoginGoogleAuth";

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
      <VerificationGaurd value={"userEmail"}>
        <Verification />
      </VerificationGaurd>
    ),
  },
  {
    path: "/verified/:verificationId",
    element: (
      <VerificationGaurd value={"userEmail"}>
        <Verified />
      </VerificationGaurd>
    ),
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:verificationId",
    element: (
      <VerificationGaurd value={"passwordEmail"}>
        <ResetPassword />
      </VerificationGaurd>
    ),
  },
  {
    path: "/password-verification",
    element: (
      <VerificationGaurd value={"passwordEmail"}>
        <PasswordVerification />
      </VerificationGaurd>
    ),
  },
  {
    path: "/password-verified",
    element: (
      <VerificationGaurd value={"passwordEmail"}>
        <PasswordVerified />
      </VerificationGaurd>
    ),
  },
  {
    path: "/redirect",
    element: <Redirect />,
  },
  {
    path: "/login/loginTwo",
    element: <LoginTwo />,
  },
  {
    path: "/login/loginGoogleAuth",
    element: <LoginGoogleAuth />,
  },
]);

export const RouterProviderBase = () => {
  return <RouterProvider router={router} />;
};
