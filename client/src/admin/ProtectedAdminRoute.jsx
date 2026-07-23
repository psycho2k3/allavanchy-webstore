import { Navigate, Outlet } from "react-router-dom";
import { isAdminAuthenticated } from "./adminAuth.js";

function ProtectedAdminRoute() {
  if (!isAdminAuthenticated()) {
    return <Navigate replace to="/admin/login" />;
  }

  return <Outlet />;
}

export default ProtectedAdminRoute;
