import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useVerifyQuery } from "../../hooks/useVerifyQuery";
import { Toaster } from "react-hot-toast";
import "./verified.css";

const Verified = () => {
  const { verificationId } = useParams();
  const { data, isError } = useVerifyQuery(verificationId);

  useEffect(() => {
    if (data) {
      localStorage.removeItem("userEmail");
    }
  }, [data]);

  return (
    <article className="verification">
      <div>
        <img className="verification__img" src="/login.webp" alt="" />
      </div>
      <div className="verification__content">
        <h2 className="verification__title">Puck</h2>
        <h3 className="verification__title verification__title--fs-mt">
          {isError
            ? "Looks like the link has expired!"
            : "Great, you are verified now!"}
        </h3>
        <img className="verification__mail-img" src="/mail.webp" alt="" />
        <p className="verification__description">
          {isError
            ? "You need to verify your email!"
            : "You can now proceed to Log in."}
        </p>
        {isError ? (
          <p className="verification__description">
            Resend email{" "}
            <Link to="/verification">Resend verification email</Link>
          </p>
        ) : (
          <p className="verification__description">
            Refresh the page or <Link to="/login">Login</Link>
          </p>
        )}
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

export default Verified;
