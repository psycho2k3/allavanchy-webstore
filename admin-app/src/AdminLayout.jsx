import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAdminSession, getAdminUser } from "./adminAuth.js";
import "./admin.css";

function AdminLayout() {
  const navigate = useNavigate();
  const adminUser = getAdminUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logout = () => {
    clearAdminSession();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar${isMenuOpen ? " admin-sidebar-open" : ""}`}>
        <div>
          <div className="admin-sidebar-heading">
            <div>
              <p className="admin-kicker">ALLAVANCHY</p>
              <h1>Admin</h1>
            </div>
            <button
              aria-controls="admin-navigation"
              aria-expanded={isMenuOpen}
              className="admin-menu-toggle"
              onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
              type="button"
            >
              {isMenuOpen ? "Close" : "Menu"}
            </button>
          </div>

          <nav className="admin-nav" id="admin-navigation" aria-label="Admin navigation">
            <NavLink end onClick={() => setIsMenuOpen(false)} to="/">
              Dashboard
            </NavLink>

            <NavLink onClick={() => setIsMenuOpen(false)} to="/products">
              Products
            </NavLink>

            <NavLink onClick={() => setIsMenuOpen(false)} to="/products/new">
              Add Product
            </NavLink>

            <NavLink onClick={() => setIsMenuOpen(false)} to="/collections">
              Collections
            </NavLink>

            <NavLink onClick={() => setIsMenuOpen(false)} to="/orders">
              Orders
            </NavLink>

            <NavLink onClick={() => setIsMenuOpen(false)} to="/users">
              Users
            </NavLink>

            <NavLink onClick={() => setIsMenuOpen(false)} to="/settings">
              Site Settings
            </NavLink>

            <NavLink onClick={() => setIsMenuOpen(false)} to="/profile">
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
