import { useEffect } from "react";
import { Link } from "react-router-dom";

const PasswordVerified = () => {
  useEffect(() => {
    localStorage.removeItem("pass-mail");
  }, []);

  return (
    <article className="verification">
      <div>
        <img className="verification__img" src="/login.webp" alt="" />
      </div>
      <div className="verification__content">
        <h2 className="verification__title">Puck</h2>
        <h3 className="verification__title verification__title--fs-mt">
          Great, your password has been reset!
        </h3>
        <img className="verification__mail-img" src="/mail.webp" alt="" />
        <p className="verification__description">
          You can now proceed to Log in.
        </p>

        <p className="verification__description">
          Refresh the page or <Link to="/login/loginTwo">Login</Link>
        </p>
      </div>
    </article>
  );
};

export default PasswordVerified;
