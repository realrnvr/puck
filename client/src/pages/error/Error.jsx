import { useNavigate } from "react-router-dom";
import "./error.css";

const Error = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/");
  };

  return (
    <section className="error">
      <div className="error__container">
        <h2 className="error__title">404</h2>
        <p className="error__description">
          You&apos;ve entered a filler episode. Let&apos;s get you back on
          track!
        </p>
        <div className="error__btn-wrapper">
          <button
            className="error__btn"
            type="button"
            onClick={handleNavigation}
          >
            Home
          </button>
        </div>
        <img
          className="error__img"
          src="/error.webp"
          alt="404-page-not-found"
        />
      </div>
    </section>
  );
};

export default Error;
