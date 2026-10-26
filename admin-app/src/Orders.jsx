import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getApiErrorMessage, getOrders } from "./adminApi.js";
import { formatMoney, useCurrency } from "./money.js";
import Pagination from "./Pagination.jsx";
import "./admin.css";

const PAGE_SIZE = 20;

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
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const currency = useCurrency();

  const loadOrders = async (targetPage = 1) => {
    setIsLoading(true);

    try {
      const data = await getOrders({
        page: targetPage,
        limit: PAGE_SIZE,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
      });
      setOrders(data.data || []);
      setPage(data.pagination?.page || targetPage);
      setPages(data.pagination?.pages || 1);
      setStatus({ type: "", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        message: getApiErrorMessage(error, "Unable to load orders"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const submitSearch = (event) => {
    event.preventDefault();
    loadOrders(1);
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
                <th>Payment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer_name || order.customer_email || "Guest"}</td>
                  <td>{formatMoney(order.total, currency)}</td>
                  <td><span className="admin-badge">{order.status}</span></td>
                  <td><span className="admin-badge">{order.payment_status === "paid" ? "Paid" : "Unpaid"}</span></td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-actions">
                      <Link to={`/orders/${order.id}`}>View</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination isLoading={isLoading} onPageChange={loadOrders} page={page} pages={pages} />
    </section>
  );
}

export default Orders;
