import { Navigate } from "react-router-dom";

const LoginGaurd = ({ children }) => {
  const parameter = localStorage.getItem("log-mail");

  if (!parameter) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default LoginGaurd;
