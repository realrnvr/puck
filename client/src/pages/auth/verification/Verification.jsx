import "./verification.css";
import { useEffect, useState } from "react";
import { reverification } from "../../../services/mutation/authMutation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Verification = () => {
  const [signMail, setSignMail] = useState("");

  useEffect(() => {
    const signMail = localStorage.getItem("sign-mail");
    if (signMail) {
      setSignMail(signMail);
    }
  }, []);

  const { mutate: reverificationMutate, isPending } = useMutation({
    mutationFn: reverification,
    onMutate: () => {
      toast.loading("Sending verification email...", {
        id: "toast-verification",
      });
    },
    onSuccess: (data) => {
      toast.success(data?.data?.message, {
        id: "toast-verification",
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message, {
        id: "toast-verification",
      });
    },
  });

  const handleClick = () => {
    reverificationMutate(signMail);
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
          Check your inbox at <strong>{signMail}</strong> and click the
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
    </article>
  );
};

export default Verification;
