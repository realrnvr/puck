import { Navigate } from "react-router-dom";

const VerificationGaurd = ({ value, children }) => {
  const parameter = localStorage.getItem(value);

  if (!parameter) {
    return (
      <Navigate to={value === "sign-mail" ? "/login" : "/forgot-password"} />
    );
  }

  return children;
};

export default VerificationGaurd;
