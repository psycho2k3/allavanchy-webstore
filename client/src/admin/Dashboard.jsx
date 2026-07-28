import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Clock,
  Package,
  PackageX,
  ShoppingCart,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getDashboard } from "./adminApi.js";
import "./admin.css";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboard();
        setMetrics(data);
      } catch (error) {
        setStatus({
          type: "error",
          message: error.response?.data?.message || "Unable to load dashboard",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <section className="admin-panel">
        <div className="admin-empty-state">Loading dashboard...</div>
      </section>
    );
  }

  if (status.message) {
    return (
      <section className="admin-panel">
        <p aria-live="assertive" className={`admin-alert admin-alert-${status.type}`}>
          {status.message}
        </p>
      </section>
    );
  }

  const stats = [
    { label: "Total Users", value: metrics.customers.total_customers, icon: Users },
    { label: "Total Products", value: metrics.products.total_products, icon: Package },
    { label: "Total Orders", value: metrics.orders.total_orders, icon: ShoppingCart },
    { label: "Pending Orders", value: metrics.orders.pending_orders, icon: Clock },
    { label: "Completed Orders", value: metrics.orders.completed_orders, icon: CheckCircle2 },
    { label: "Cancelled Orders", value: metrics.orders.cancelled_orders, icon: XCircle },
    {
      label: "Total Revenue",
      value: currencyFormatter.format(Number(metrics.sales.total_revenue || 0)),
      icon: Wallet,
    },
    { label: "Low Stock Products", value: metrics.products.low_stock_count, icon: AlertTriangle },
    { label: "Out of Stock Products", value: metrics.products.out_of_stock_count, icon: PackageX },
  ];

  return (
    <section className="admin-panel">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Overview</p>
          <h2>Dashboard</h2>
        </div>
      </div>

      <div className="admin-stat-grid">
        {stats.map(({ label, value, icon: Icon }) => (
          <div className="admin-stat-card" key={label}>
            <Icon aria-hidden="true" color="var(--admin-accent)" size={18} strokeWidth={1.5} />
            <p className="admin-stat-label" style={{ marginTop: "12px" }}>
              {label}
            </p>
            <p className="admin-stat-value">{value}</p>
          </div>
        ))}
      </div>

      <div className="admin-dashboard-grid">
        <div className="admin-dashboard-panel">
          <h3>Recent Orders</h3>
          {metrics.recent_orders.length === 0 ? (
            <p className="admin-empty-state">Orders will appear here once customers start buying.</p>
          ) : (
            <ul className="admin-list">
              {metrics.recent_orders.map((order) => (
                <li key={order.id}>
                  <span>#{order.id} — {order.customer_name || order.customer_email || "Guest"}</span>
                  <span>
                    {currencyFormatter.format(Number(order.total || 0))} · {order.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="admin-dashboard-panel">
          <h3>Recent User Registrations</h3>
          {metrics.recent_users.length === 0 ? (
            <p className="admin-empty-state">New sign-ups will appear here.</p>
          ) : (
            <ul className="admin-list">
              {metrics.recent_users.map((user) => (
                <li key={user.id}>
                  <span>{user.name}</span>
                  <span>{user.role}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="admin-dashboard-panel">
          <h3>Recently Added Products</h3>
          {metrics.recent_products.length === 0 ? (
            <p className="admin-empty-state">Products you add will appear here.</p>
          ) : (
            <ul className="admin-list">
              {metrics.recent_products.map((product) => (
                <li key={product.id}>
                  <span>{product.name}</span>
                  <span>{currencyFormatter.format(Number(product.price || 0))}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="admin-dashboard-panel">
          <h3>Low Stock Products</h3>
          {metrics.low_stock_products.length === 0 ? (
            <p className="admin-empty-state">Nothing running low right now.</p>
          ) : (
            <ul className="admin-list">
              {metrics.low_stock_products.map((product) => (
                <li key={product.id}>
                  <span>{product.name}</span>
                  <span className={Number(product.stock) === 0 ? "admin-stock-low" : ""}>
                    {product.stock} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="admin-page-header" style={{ marginTop: "2rem" }}>
        <Boxes aria-hidden="true" size={0} />
        <Link className="admin-secondary-button" to="/admin/products">
          Manage Products
        </Link>
      </div>
    </section>
  );
}

export default Dashboard;