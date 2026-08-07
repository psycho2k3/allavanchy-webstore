import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrder, updateOrderStatus } from "./adminApi.js";
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

function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadOrder = async () => {
    setIsLoading(true);

    try {
      const data = await getOrder(orderId);
      setOrder(data);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Unable to load order",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const changeStatus = async (event) => {
    const nextStatus = event.target.value;
    setIsSaving(true);

    try {
      const updatedOrder = await updateOrderStatus(order.id, nextStatus);
      setOrder((currentOrder) => ({ ...currentOrder, ...updatedOrder }));
      setStatus({ type: "success", message: "Order status updated" });
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
        <div className="admin-empty-state">Loading order...</div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="admin-panel">
        <p className="admin-alert admin-alert-error">{status.message || "Order not found."}</p>
        <Link className="admin-secondary-button" style={{ marginTop: "20px" }} to="/admin/orders">
          Back to orders
        </Link>
      </section>
    );
  }

  return (
    <section className="admin-panel">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Order</p>
          <h2>#{order.id}</h2>
        </div>
        <Link className="admin-secondary-button" to="/admin/orders">
          Back to orders
        </Link>
      </div>

      {status.message && <p className={`admin-alert admin-alert-${status.type}`}>{status.message}</p>}

      <div className="admin-dashboard-grid" style={{ marginTop: "24px" }}>
        <div className="admin-dashboard-panel">
          <h3>Customer</h3>
          <ul className="admin-list">
            <li><span>Name</span><span>{order.customer_name || "Guest"}</span></li>
            <li><span>Email</span><span>{order.customer_email || "—"}</span></li>
            <li><span>Placed</span><span>{new Date(order.created_at).toLocaleDateString()}</span></li>
          </ul>
        </div>

        <div className="admin-dashboard-panel">
          <h3>Status</h3>
          <label className="admin-form" style={{ margin: 0 }}>
            Order status
            <select
              className="admin-select"
              disabled={isSaving}
              onChange={changeStatus}
              value={order.status}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="admin-page-header" style={{ marginTop: "32px" }}>
        <h3 style={{ margin: 0 }}>Items</h3>
      </div>

      {!order.items || order.items.length === 0 ? (
        <div className="admin-empty-state">No line items recorded for this order.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.product_name}</td>
                  <td>{item.quantity}</td>
                  <td>{currencyFormatter.format(Number(item.price || 0))}</td>
                  <td>
                    {currencyFormatter.format(Number(item.price || 0) * Number(item.quantity || 0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="admin-page-header" style={{ marginTop: "20px" }}>
        <div />
        <p style={{ fontWeight: 700 }}>
          Order total: {currencyFormatter.format(Number(order.total || 0))}
        </p>
      </div>
    </section>
  );
}

export default OrderDetail;