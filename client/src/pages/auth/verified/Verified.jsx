import "./verified.css";
import { useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { verify } from "../../../services/mutation/authMutation";
import { useAuth } from "../../../hooks/useAuth";
import Loader from "../../../components/ui/loader/Loader";
import toast from "react-hot-toast";

const Verified = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { verificationId } = useParams();
  const hasRun = useRef(false);

  const { mutate: verifyMutate, error } = useMutation({
    mutationFn: verify,
    onSuccess: (data) => {
      auth.setToken(data?.data?.accessToken);
      toast.success("hello :)");
      navigate("/account");
      localStorage.removeItem("sign-mail");
    },
    onError: (error) => {
      toast.success("Something went wrong");
      console.log(error);
    },
  });

  useEffect(() => {
    if (!hasRun.current) {
      const signMail = localStorage.getItem("sign-mail");
      if (verificationId && signMail) {
        verifyMutate({
          verificationId,
          email: signMail,
        });
      }
      hasRun.current = true;
    }
  }, [verificationId, verifyMutate]);

  if (!error)
    return (
      <div className="verified__loader">
        <Loader />
      </div>
    );

  return (
    <article className="verification">
      <div>
        <img className="verification__img" src="/login.webp" alt="" />
      </div>
      <div className="verification__content">
        <h2 className="verification__title">Puck</h2>
        <h3 className="verification__title verification__title--fs-mt">
          Looks like the link has expired!
        </h3>
        <img className="verification__mail-img" src="/mail.webp" alt="" />
        <p className="verification__description">
          You need to verify your email!
        </p>
        <p className="verification__description">
          Resend email <Link to="/verification">Resend verification email</Link>
        </p>
      </div>
    </article>
  );
};

export default Verified;
