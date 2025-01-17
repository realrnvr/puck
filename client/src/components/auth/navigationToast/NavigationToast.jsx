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
          className="signup__btn v-toast__t-verification-btn"
          onClick={() => {
            localStorage.setItem(path, email);
            navigate(to);
            toast.dismiss(toastId);
          }}
        >
          {btnText}
        </button>
        <button
          className="signup__btn v-toast__t-close-btn"
          onClick={() => toast.dismiss(toastId)}
        >
          Close
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
