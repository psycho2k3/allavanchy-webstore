import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAdminSession, getAdminUser } from "./adminAuth.js";
import "./admin.css";

function AdminLayout() {
  const navigate = useNavigate();
  const adminUser = getAdminUser();

  const logout = () => {
    clearAdminSession();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <p className="admin-kicker">ALLAVANCHY</p>

          <h1>Admin</h1>

          <nav className="admin-nav" aria-label="Admin navigation">
            <NavLink end to="/">
              Dashboard
            </NavLink>

            <NavLink to="/products">
              Products
            </NavLink>

            <NavLink to="/products/new">
              Add Product
            </NavLink>

            <NavLink to="/collections">
              Collections
            </NavLink>

            <NavLink to="/orders">
              Orders
            </NavLink>

            <NavLink to="/users">
              Users
            </NavLink>

            <NavLink to="/settings">
              Site Settings
            </NavLink>

            <NavLink to="/profile">
              My Profile
            </NavLink>
          </nav>
        </div>

        <div className="admin-sidebar-footer">
          <p>{adminUser?.email}</p>

          <button
            className="admin-ghost-button"
            onClick={logout}
            type="button"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;