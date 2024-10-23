import React, { useEffect, useState } from "react";
import { useReverificationMutation } from "../../hooks/useReverificationMutation";
import { Toaster } from "react-hot-toast";
import "./verification.css";

const Verification = () => {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const { mutate: reverificationMutate, isPending } =
    useReverificationMutation();

  const handleClick = () => {
    reverificationMutate(userEmail);
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
          Check your inbox at <strong>{userEmail}</strong> and click the
          verrification link inside to complete your registration. This link
          will expire shortly, so verify soon!
        </p>
        <p className="verification__description">
          <strong>Don't see an email?</strong> Check your spam folder.
        </p>
        <p className="verification__description">
          Link expired?{" "}
          <button
            className="verification__btn"
            onClick={handleClick}
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

export default Verification;
