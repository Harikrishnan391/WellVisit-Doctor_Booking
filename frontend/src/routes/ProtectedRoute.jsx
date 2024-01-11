// import { useContext } from "react";
import { Navigate } from "react-router-dom";
// import { authContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  // const { token, role } = useContext(authContext);
  const user = JSON.parse(localStorage.getItem("PatientInfo"));
  if (user) {
    const role = user.role;
    const token = user.token;
    const isAllowed = allowedRoles.includes(role);
    const accessibleRoute =
      token && isAllowed ? children : <Navigate to="/users/login" replace={true} />;
    return accessibleRoute;
  } else {
    return <Navigate to="/users/login" replace={true} />;
  }
};

export default ProtectedRoute;
