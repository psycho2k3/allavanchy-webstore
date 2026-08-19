import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "./adminApi.js";
import "./admin.css";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const statusOptions = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Completed",
  "Cancelled",
  "Refunded",
];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    setIsLoading(true);

    try {
      const data = await getOrders({
        search: searchTerm || undefined,
        status: statusFilter || undefined,
      });
      setOrders(data.data || []);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Unable to load orders",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const submitSearch = (event) => {
    event.preventDefault();
    loadOrders();
  };

  return (
    <section className="admin-panel">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Sales</p>
          <h2>Orders</h2>
        </div>
      </div>

      <form className="admin-toolbar admin-toolbar-wrap" onSubmit={submitSearch}>
        <input
          aria-label="Search orders by customer"
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by customer name or email"
          type="search"
          value={searchTerm}
        />

        <select
          aria-label="Filter by status"
          className="admin-select"
          onChange={(event) => setStatusFilter(event.target.value)}
          value={statusFilter}
        >
          <option value="">All statuses</option>
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </form>

      {status.message && <p className={`admin-alert admin-alert-${status.type}`}>{status.message}</p>}

      {isLoading ? (
        <div className="admin-empty-state">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="admin-empty-state">No orders found.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer_name || order.customer_email || "Guest"}</td>
                  <td>{currencyFormatter.format(Number(order.total || 0))}</td>
                  <td><span className="admin-badge">{order.status}</span></td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-actions">
                      <Link to={`/admin/orders/${order.id}`}>View</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Orders;
