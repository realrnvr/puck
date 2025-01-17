import "./go-back-btn.css";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const GoBackBtn = ({ text = "back" }) => {
  const navigate = useNavigate();

  const handelClick = () => {
    navigate(-1);
  };

  return (
    <button className="go" onClick={handelClick}>
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
};

export default GoBackBtn;
