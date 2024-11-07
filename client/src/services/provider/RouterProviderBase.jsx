import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

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
import PasswordVerifiedGaurd from "../auth/passwordVerifiedGaurd";
import PasswordVerified from "../../pages/auth/passwordVerified/PasswordVerified";
import Redirect from "../../pages/auth/redirect/Redirect";
import LoginTwo from "../../components/auth/loginTwo/LoginTwo";
import LoginGoogleAuth from "../../components/auth/loginGoogleAuth/LoginGoogleAuth";
import { GoogleOAuthProviderBase } from "./GoogleOAuthProviderBase";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <GoogleOAuthProviderBase>
            <Template template="login">
              <Login />
            </Template>
          </GoogleOAuthProviderBase>
        }
      />
      <Route
        path="/login/loginTwo"
        element={
          <LoginGaurd>
            <LoginTwo />
          </LoginGaurd>
        }
      />
      <Route
        path="/login/loginGoogleAuth"
        element={
          <LoginGaurd>
            <LoginGoogleAuth />
          </LoginGaurd>
        }
      />
      <Route
        path="signup"
        element={
          <GoogleOAuthProviderBase>
            <Template template="signup">
              <Signup />
            </Template>
          </GoogleOAuthProviderBase>
        }
      />
      <Route
        path="/verification"
        element={
          <VerificationGaurd value={"sign-mail"}>
            <Verification />
          </VerificationGaurd>
        }
      />
      <Route
        path="/verified/:verificationId"
        element={
          <VerificationGaurd value={"sign-mail"}>
            <Verified />
          </VerificationGaurd>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <LoginGaurd>
            <ForgotPassword />
          </LoginGaurd>
        }
      />
      <Route
        path="/reset-password/:verificationId"
        element={
          <VerificationGaurd value={"pass-mail"}>
            <ResetPassword />
          </VerificationGaurd>
        }
      />
      <Route
        path="/password-verification"
        element={
          <VerificationGaurd value={"pass-mail"}>
            <PasswordVerification />
          </VerificationGaurd>
        }
      />
      <Route
        path="/password-verified"
        element={
          <PasswordVerifiedGaurd>
            <PasswordVerified />
          </PasswordVerifiedGaurd>
        }
      />
      <Route path="/redirect" element={<Redirect />} />
    </>
  )
);

export const RouterProviderBase = () => {
  return <RouterProvider router={router} />;
};
