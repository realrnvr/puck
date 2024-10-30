import "./password-verification.css";
import { useEffect, useState } from "react";
import { resendPasswordVerification } from "../../../services/mutation/authMutation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const PasswordVerification = () => {
  const [passwordEmail, setPasswordEmail] = useState("");

  useEffect(() => {
    const passwordEmail = localStorage.getItem("passwordEmail");
    if (passwordEmail) {
      setPasswordEmail(passwordEmail);
    }
  }, []);

  const { mutate: resendPasswordVerificationMutate, isPending } = useMutation({
    mutationFn: resendPasswordVerification,
    onMutate: () => {
      toast.loading("Sending verification email...", {
        id: "toast-verification",
      });
    },
    onSuccess: (data) => {
      toast.dismiss("toast-verification");
      toast.success(data?.data?.message, {
        id: "toast-verification",
      });
    },
    onError: (error) => {
      toast.dismiss("toast-verification");
      toast.error(error.response?.data?.message, {
        id: "toast-verification",
      });
    },
  });

  const onSubmit = () => {
    resendPasswordVerificationMutate(passwordEmail);
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
    </article>
  );
};

export default PasswordVerification;
