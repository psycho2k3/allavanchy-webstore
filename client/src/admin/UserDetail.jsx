import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUser, updateUserRole, updateUserStatus } from "./adminApi.js";
import { getAdminUser } from "./adminAuth.js";
import "./admin.css";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function UserDetail() {
  const { userId } = useParams();
  const currentAdmin = getAdminUser();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadUser = async () => {
    setIsLoading(true);

    try {
      const data = await getUser(userId);
      setUser(data.user);
      setOrders(data.orders || []);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Unable to load user",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const isSelf = currentAdmin?.id === user?.id;

  const changeRole = async (event) => {
    const nextRole = event.target.value;
    setIsSaving(true);

    try {
      const updatedUser = await updateUserRole(user.id, nextRole);
      setUser(updatedUser);
      setStatus({ type: "success", message: "Role updated" });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Unable to update role",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatus = async () => {
    const nextStatus = user.status === "suspended" ? "active" : "suspended";
    setIsSaving(true);

    try {
      const updatedUser = await updateUserStatus(user.id, nextStatus);
      setUser(updatedUser);
      setStatus({
        type: "success",
        message: nextStatus === "suspended" ? "User suspended" : "User reactivated",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Unable to update status",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <section className="admin-panel">
        <div className="admin-empty-state">Loading user...</div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="admin-panel">
        <p className="admin-alert admin-alert-error">{status.message || "User not found."}</p>
        <Link className="admin-secondary-button" style={{ marginTop: "20px" }} to="/admin/users">
          Back to users
        </Link>
      </section>
    );
  }

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  return (
    <section className="admin-panel">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Account</p>
          <h2>{user.name}</h2>
        </div>
        <Link className="admin-secondary-button" to="/admin/users">
          Back to users
        </Link>
      </div>

      {status.message && <p className={`admin-alert admin-alert-${status.type}`}>{status.message}</p>}

      <div className="admin-dashboard-grid" style={{ marginTop: "24px" }}>
        <div className="admin-dashboard-panel">
          <h3>Details</h3>
          <ul className="admin-list">
            <li><span>Email</span><span>{user.email}</span></li>
            <li><span>Joined</span><span>{new Date(user.created_at).toLocaleDateString()}</span></li>
            <li><span>Orders</span><span>{orders.length}</span></li>
            <li><span>Total spent</span><span>{currencyFormatter.format(totalSpent)}</span></li>
          </ul>
        </div>

        <div className="admin-dashboard-panel">
          <h3>Account controls</h3>

          {isSelf ? (
            <p className="admin-empty-state">
              You cannot change your own role or status here. Use My Profile instead.
            </p>
          ) : (
            <div style={{ display: "grid", gap: "16px" }}>
              <label className="admin-form" style={{ margin: 0 }}>
                Role
                <select
                  className="admin-select"
                  disabled={isSaving}
                  onChange={changeRole}
                  value={user.role}
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </label>

              <button
                className="admin-secondary-button"
                disabled={isSaving}
                onClick={toggleStatus}
                type="button"
              >
                {user.status === "suspended" ? "Reactivate user" : "Suspend user"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="admin-page-header" style={{ marginTop: "32px" }}>
        <h3 style={{ margin: 0 }}>Order history</h3>
      </div>

      {orders.length === 0 ? (
        <div className="admin-empty-state">This customer hasn't placed any orders yet.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{currencyFormatter.format(Number(order.total || 0))}</td>
                  <td>{order.status}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default UserDetail;