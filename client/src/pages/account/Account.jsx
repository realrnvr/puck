import "./account.css";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const Account = () => {
  const { user } = useAuth();

  console.log(user);

  return (
    <section className="account | container">
      <div>
        <h2 className="account__username">{user?.username}</h2>
        <div>
          <Link to="/account-setting" className="account__settings">
            Account Settings
          </Link>
        </div>
        <div>
          <Link
            to={
              user?.type === "google"
                ? console.log("google login pls create password first")
                : "/change-password"
            }
            className="account__settings"
          >
            Change Password
          </Link>
        </div>
      </div>
      <div className="account__btn-container">
        <Link className="account__btn" to="/favourite">
          Favourites
        </Link>
      </div>
    </section>
  );
};

export default Account;
