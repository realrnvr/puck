import PropTypes from "prop-types";
import { useDisableEvent } from "../../../hooks/useDisableEvent";

const Button = ({ isOpen, onClick, className }) => {
  useDisableEvent(isOpen);

  return (
    <button type="button" className={className} onClick={onClick}>
      {isOpen ? (
        <svg
          className="controller__close-svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M18.707 12.707l-1.414-1.414L13 15.586V6h-2v9.586l-4.293-4.293-1.414 1.414L12 19.414z" />
        </svg>
      ) : (
        <svg
          className="controller__close-svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M11 8.414V18h2V8.414l4.293 4.293 1.414-1.414L12 4.586l-6.707 6.707 1.414 1.414z" />
        </svg>
      )}
    </button>
  );
};

Button.propTypes = {
  isOpen: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;
