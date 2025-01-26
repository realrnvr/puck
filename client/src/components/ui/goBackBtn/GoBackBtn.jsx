import "./go-back-btn.css";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const GoBackBtn = ({ text = "back", redirectPath = "/account" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (location.pathname === redirectPath) {
      navigate("/");
    } else {
      navigate(-1);
    }
  };

  return (
    <button className="go" onClick={handleClick}>
      <svg className="go__svg" fill="currentColor" viewBox="0 0 512 512">
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="square"
          strokeMiterlimit={10}
          strokeWidth={48}
          d="M328 112 184 256l144 144"
        />
      </svg>
      <span className="go__text">{text}</span>
    </button>
  );
};

GoBackBtn.propTypes = {
  text: PropTypes.string,
  redirectPath: PropTypes.string, // Path to check where the user came from
};

export default GoBackBtn;
