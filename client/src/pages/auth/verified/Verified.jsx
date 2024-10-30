import "./verified.css";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { verify } from "../../../services/mutation/authMutation";
import { useAuth } from "../../../hooks/useAuth";

const Verified = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { verificationId } = useParams();

  const { mutate: verifyMutate } = useMutation({
    mutationFn: verify,
    onSuccess: (data) => {
      console.log(data);
      auth.setToken(data?.data?.accessToken);
      navigate("/account");
      localStorage.removeItem("userEmail");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (verificationId && userEmail)
      verifyMutate({
        verificationId,
        email: userEmail,
      });
  }, [verificationId]);

  return (
    <article className="verification">
      <div>
        <img className="verification__img" src="/login.webp" alt="" />
      </div>
      <div className="verification__content">
        <h2 className="verification__title">Puck</h2>
        {/* <h3 className="verification__title verification__title--fs-mt">
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
            Refresh the page or <Link to="/account">Account</Link>
          </p>
        )} */}
      </div>
    </article>
  );
};

export default Verified;
