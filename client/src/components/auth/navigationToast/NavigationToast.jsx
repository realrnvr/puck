import "./navigation-toast.css";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

const NavigationToast = ({
  email,
  navigate,
  to,
  toastId,
  path,
  message,
  btnText,
}) => {
  return (
    <div className="v-toast__toaster">
      <p className="v-toast__t-description">{message}</p>
      <div className="v-toast__t-container">
        <button
          className="v-toast__t-verification-btn"
          onClick={() => {
            localStorage.setItem(path, email);
            navigate(to);
            toast.dismiss(toastId);
          }}
        >
          {btnText}
        </button>
        <button
          className="v-toast__t-close-btn"
          onClick={() => toast.dismiss(toastId)}
        >
          <svg className="v-toast__t-close-btn-svg" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

NavigationToast.propTypes = {
  email: PropTypes.string,
  navigate: PropTypes.func,
  to: PropTypes.string,
  toastId: PropTypes.string,
  path: PropTypes.string,
  message: PropTypes.string,
  btnText: PropTypes.string,
};

export default NavigationToast;
