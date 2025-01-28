import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import PropTypes from "prop-types";
import AccountSettingSkeleton from "../../utils/skeletons/accountSettingSkeleton/AccountSettingSkeleton";
import ChangePasswordSkeleton from "../../utils/skeletons/changePassword/ChangePasswordSkeleton";
import AccountSkeleton from "../../utils/skeletons/account/AccountSkeleton";

const RestrictAccountSection = ({
  children,
  to = "/login",
  type = "account",
}) => {
  const auth = useAuth();

  const skeleton = {
    account: <AccountSkeleton />,
    accountSetting: <AccountSettingSkeleton />,
    changePassword: <ChangePasswordSkeleton />,
  };

  const getSkeleton = (type) => {
    return skeleton[type];
  };

  if (auth.mutateTokenPending) {
    return getSkeleton(type);
  }

  if (!auth.token) {
    return <Navigate to={to} replace />;
  }

  return children;
};

RestrictAccountSection.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string,
  type: PropTypes.oneOf(["account", "accountSetting", "changePassword"]),
};

export default RestrictAccountSection;
