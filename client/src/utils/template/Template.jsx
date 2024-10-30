import React from "react";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import "./template.css";

const Template = ({ children, template }) => {
  const login = useGoogleLogin({
    flow: "auth-code",
    ux_mode: "redirect",
    redirect_uri: "http://localhost:5173/redirect",
    onError: (error) => console.error("Login Failed", error),
  });

  return (
    <article className="template | container">
      <div className="template__l-container">
        <Link to="/" className="template__heading">
          Welcome to Puck
        </Link>
        <p className="template__brief">
          Start enjoying your favourite anime and manga!
        </p>
      </div>
      <div className="template__r-container">
        <div className="template__content">
          <div className="template__wrapper">
            <div className="template__top-container">
              <h2 className="template__title">
                {template === "login" ? "Log In" : "Sign Up"}
              </h2>
              <p className="template__description">
                {template === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <Link
                  to={template === "login" ? "/signup" : "/login"}
                  className="template__link template__goto-btn"
                >
                  {template === "login" ? "Sign Up" : "Log In"}
                </Link>
              </p>
            </div>
            {children}
            <div className="template__bottom-container">
              <p className="template__description">or</p>
              <button onClick={login} className="template__google-btn">
                <svg
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  className="template__icon template__btn--border"
                >
                  <path d="M15.545 6.558a9.42 9.42 0 01.139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 118 0a7.689 7.689 0 015.352 2.082l-2.284 2.284A4.347 4.347 0 008 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 000 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 001.599-2.431H8v-3.08h7.545z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Template;
