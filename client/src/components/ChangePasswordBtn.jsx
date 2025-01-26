import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import NavigationToast from "./auth/navigationToast/NavigationToast";

const ChangePasswordBtn = ({ user, isPending, disabled }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (user.type === "google") {
      toast(
        <NavigationToast
          message={
            "Looks like you are a google login please create a password first"
          }
          btnText={"here"}
          email={user?.email}
          navigate={navigate}
          to={"/login/loginGoogleAuth"}
          toastId={"create-password-toast"}
          path={"log-mail"}
        />,
        {
          duration: 10000,
          id: "create-password-toast",
        }
      );
    } else {
      navigate("/change-password");
    }
  };

  return (
    <button
      type="button"
      className="account__change-btn"
      onClick={handleClick}
      disabled={isPending || disabled}
    >
      Change Password
    </button>
  );
};

ChangePasswordBtn.propTypes = {
  user: PropTypes.object,
  isPending: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default ChangePasswordBtn;
