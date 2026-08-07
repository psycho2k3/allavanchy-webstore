import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedPage from '../components/motion/AnimatedPage.jsx';
import { getMyOrders } from '../services/orderApi.js';

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

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
                    <p className="mt-1 text-sm text-allavanchy-graphite">{order.status}</p>
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