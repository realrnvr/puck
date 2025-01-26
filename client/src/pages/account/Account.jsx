import "./account.css";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import ChangePasswordBtn from "../../components/ChangePasswordBtn";
import ErrorComp from "../../utils/errorComp/ErrorComp";
import GoBackBtn from "../../components/ui/goBackBtn/GoBackBtn";

const Account = () => {
  const { user, isPending, userError } = useAuth();

  return (
    <section className="account | container">
      <GoBackBtn />
      <h2 className="account__title account__title--mt">Account section</h2>
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
          {userError ? <ErrorComp height="70px" width="150px" /> : null}
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
          {userError ? (
            <ErrorComp
              height="20px"
              width="150px"
              className={"error-comp--mt-0_5"}
            />
          ) : null}
        </p>
        <div>
          <Link to="/account-setting" className="account__settings">
            Account Settings
          </Link>
        </div>
        <div>
          <ChangePasswordBtn
            user={user}
            isPending={isPending}
            disabled={userError}
          />
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
