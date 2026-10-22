import { GoogleOAuthProviderBase } from "../services/provider/GoogleOAuthProviderBase";
import Template from "../utils/template/Template";
import Verification from "../pages/auth/verification/Verification";
import Verified from "../pages/auth/verified/Verified";
import ForgotPassword from "../pages/auth/forgotPassword/ForgotPassword";
import ResetPassword from "../pages/auth/resetPassword/ResetPassword";
import PasswordVerification from "../pages/auth/passwordVerification/PasswordVerification";
import PasswordVerified from "../pages/auth/passwordVerified/PasswordVerified";
import LoginTwo from "../components/auth/loginTwo/LoginTwo";
import LoginGoogleAuth from "../components/auth/loginGoogleAuth/LoginGoogleAuth";
import AuthRedirectGuard from "../services/auth/AuthRedirectGuard";
import ProcessGuard from "../services/auth/ProcessGuard";
import LoginSkeleton from "../utils/skeletons/login/LoginSkeleton";
import SignupSkeleton from "../utils/skeletons/signup/SignupSkeleton";
import { LazyLogin, LazySignup } from "./lazyPages";
import { LazyRouteElement } from "./lazyRouteElement";

export const authRoutes = [
  {
    path: "/login",
    element: (
      <GoogleOAuthProviderBase>
        <AuthRedirectGuard>
          <Template template="login">
            <LazyRouteElement
              component={LazyLogin}
              fallback={<LoginSkeleton />}
            />
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
            <LazyRouteElement
              component={LazySignup}
              fallback={<SignupSkeleton />}
            />
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
];
