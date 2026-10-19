import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedPage from '../components/motion/AnimatedPage.jsx';
import { getMyOrders } from '../services/orderApi.js';
import { redirectToPayment } from '../services/paymentApi.js';

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [payingOrderId, setPayingOrderId] = useState(null);
  const [payError, setPayError] = useState('');

  const payNow = async (orderId) => {
    setPayError('');
    setPayingOrderId(orderId);

    try {
      await redirectToPayment(orderId);
    } catch (error) {
      setPayError(error.response?.data?.message || 'Unable to start payment');
      setPayingOrderId(null);
    }
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (error) {
        setLoadError(error.response?.data?.message || 'Unable to load your orders');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <AnimatedPage className="bg-allavanchy-ivory pb-20 pt-28">
      <div className="av-container">
        <div className="border-b border-allavanchy-stone pb-8">
          <p className="av-eyebrow">Account</p>
          <h1 className="av-heading-xl mt-3">My Orders</h1>
        </div>

        <div className="py-8">
          {isLoading ? (
            <p className="av-body">Loading orders...</p>
          ) : loadError ? (
            <p className="av-body">{loadError}</p>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center">
              <p className="av-body">You haven't placed any orders yet.</p>
              <Link className="av-button-primary mt-8" to="/shop">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {payError && (
                <p className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{payError}</p>
              )}
              {orders.map((order) => (
                <div className="flex items-center justify-between border border-allavanchy-stone bg-allavanchy-pearl p-5" key={order.id}>
                  <div>
                    <p className="text-sm font-medium uppercase tracking-luxury">Order #{order.id}</p>
                    <p className="mt-1 text-sm text-allavanchy-graphite">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{currencyFormatter.format(Number(order.total || 0))}</p>
                    <p className="mt-1 text-sm text-allavanchy-graphite">
                      {order.status} · {order.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                    </p>
                    {order.payment_status !== 'paid' && order.status !== 'Cancelled' && (
                      <button
                        className="av-button-primary mt-3"
                        disabled={payingOrderId === order.id}
                        onClick={() => payNow(order.id)}
                        type="button"
                      >
                        {payingOrderId === order.id ? 'Redirecting...' : 'Pay Now'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
}

export default MyOrders;