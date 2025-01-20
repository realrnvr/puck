import "./account.css";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import ChangePasswordBtn from "../../components/ChangePasswordBtn";

const Account = () => {
  const { user, isPending } = useAuth();

  return (
    <section className="account | container">
      <h2 className="account__title">Account section</h2>
      <div className="acount__content">
        <h2 className="account__username">
          {isPending ? (
            <Skeleton
              baseColor="#202020"
              highlightColor="#444"
              height={"100%"}
              width={"150px"}
            />
          ) : (
            user?.username
          )}
        </h2>
        <p className="account__mail">
          {isPending ? (
            <Skeleton
              baseColor="#202020"
              highlightColor="#444"
              height={"100%"}
              width={"150px"}
            />
          ) : (
            user?.email
          )}
        </p>
        <div>
          <Link to="/account-setting" className="account__settings">
            Account Settings
          </Link>
        </div>
        <div>
          <ChangePasswordBtn user={user} isPending={isPending} />
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
