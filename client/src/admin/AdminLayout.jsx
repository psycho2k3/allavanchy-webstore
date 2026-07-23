import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAdminSession, getAdminUser } from "./adminAuth.js";
import "./admin.css";

function AdminLayout() {
  const navigate = useNavigate();
  const adminUser = getAdminUser();

  const logout = () => {
    clearAdminSession();
    navigate("/admin/login");
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <p className="admin-kicker">ALLAVANCHY</p>
          <h1>Admin</h1>
        </div>

        <nav className="admin-nav" aria-label="Admin navigation">
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/products/new">Add Product</NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <p>{adminUser?.email}</p>
          <button className="admin-ghost-button" onClick={logout} type="button">
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
