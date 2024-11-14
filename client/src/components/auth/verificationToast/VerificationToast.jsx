import "./verification-toast.css";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

const VerificationToast = ({ email, navigate }) => {
  return (
    <div className="v-toast__toaster">
      <p className="v-toast__t-description">
        Please verify your email to continue.
      </p>
      <div className="v-toast__t-container">
        <button
          className="signup__btn v-toast__t-verification-btn"
          onClick={() => {
            localStorage.setItem("sign-mail", email);
            navigate("/verification");
            toast.dismiss("verification-toast");
          }}
        >
          Verification here
        </button>
        <button
          className="signup__btn v-toast__t-close-btn"
          onClick={() => toast.dismiss("verification-toast")}
        >
          Close
        </button>
      </div>
    </div>
  );
};

VerificationToast.propTypes = {
  email: PropTypes.string.isRequired,
  navigate: PropTypes.string.isRequired,
};

export default VerificationToast;
