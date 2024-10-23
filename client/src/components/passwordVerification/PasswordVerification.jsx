import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useResendPasswordVerificationMutation } from "../../hooks/useResendPasswordVerificationMutation";
import "./password-verification.css";

const PasswordVerification = () => {
  const [passwordEmail, setPasswordEmail] = useState("");

  useEffect(() => {
    const passwordEmail = localStorage.getItem("passwordEmail");
    if (passwordEmail) {
      setPasswordEmail(passwordEmail);
    }
  }, []);

  const { mutateAsync: resendPasswordVerificationMutate, isPending } =
    useResendPasswordVerificationMutation();

  const onSubmit = async () => {
    try {
      resendPasswordVerificationMutate(passwordEmail);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <article className="verification">
      <div>
        <img className="verification__img" src="/login.webp" alt="" />
      </div>
      <div className="verification__content">
        <h2 className="verification__title">Puck</h2>
        <h3 className="verification__title verification__title--fs-mt">
          Great, now verify your email!
        </h3>
        <img className="verification__mail-img" src="/mail.webp" alt="" />
        <p className="verification__description">
          Check your inbox at <strong>{passwordEmail}</strong> and click the
          verification link inside to complete your registration. This link will
          expire shortly, so verify soon!
        </p>
        <p className="verification__description">
          <strong>Don't see an email?</strong> Check your spam folder.
        </p>
        <p className="verification__description">
          Link expired?{" "}
          <button
            className="verification__btn"
            onClick={onSubmit}
            type="button"
            disabled={isPending}
          >
            Resend verification email
          </button>
        </p>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            color: "#191815",
            fontSize: "1rem",
          },
          iconTheme: {
            primary: "#191815",
            secondary: "#ffffe3",
          },
        }}
      />
    </article>
  );
};

export default PasswordVerification;
