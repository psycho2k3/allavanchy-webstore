import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAdminAuthenticated } from "./adminAuth.js";

function ProtectedAdminRoute() {
  const location = useLocation();

  if (!isAdminAuthenticated()) {
    return (
      <Navigate
        replace
        to="/login"
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedAdminRoute;
