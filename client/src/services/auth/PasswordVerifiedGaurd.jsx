import { Navigate } from "react-router-dom";

const PasswordVerifiedGaurd = ({ children }) => {
  const parameter = localStorage.getItem("pass-mail");

  if (!parameter) {
    return <Navigate to="/login/loginTwo" />;
  }
  return children;
};

export default PasswordVerifiedGaurd;
