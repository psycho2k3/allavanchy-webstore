import { Link, useLocation } from 'react-router-dom';
import AnimatedPage from '../components/motion/AnimatedPage.jsx';
import useCart from '../hooks/useCart.js';
import { formatMoney } from '../utils/money.js';

function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order;
  const { currency } = useCart();

  return (
    <AnimatedPage className="bg-allavanchy-ivory pb-20 pt-28">
      <div className="av-container py-16 text-center">
        <h1 className="av-heading-xl">Thank You</h1>
        {order ? (
          <>
            <p className="av-body mx-auto mt-4 max-w-md">
              Your payment was received and your order is confirmed.
            </p>
            <div className="mx-auto mt-8 max-w-sm border border-allavanchy-stone bg-allavanchy-pearl p-6 text-left">
              <p className="text-sm text-allavanchy-graphite">Order Number</p>
              <p className="text-lg font-medium">#{order.id}</p>
              <p className="mt-4 text-sm text-allavanchy-graphite">Total</p>
              <p className="text-lg font-medium">{formatMoney(order.total || 0, currency)}</p>
              <p className="mt-4 text-sm text-allavanchy-graphite">Status</p>
              <p className="text-lg font-medium">{order.status || 'Pending'}</p>
              <p className="mt-4 text-sm text-allavanchy-graphite">Payment</p>
              <p className="text-lg font-medium">{order.payment_status === 'paid' ? 'Paid' : 'Awaiting payment'}</p>
              {Array.isArray(order.items) && order.items.length > 0 && (
                <>
                  <p className="mt-4 text-sm text-allavanchy-graphite">Items</p>
                  <ul className="mt-1 space-y-1 text-sm">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.product_name} × {item.quantity}
                        {item.size ? ` · Size ${item.size}` : ''}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </>
        ) : (
          <p className="av-body mx-auto mt-4 max-w-md">
            We couldn't find your order details, but if you just checked out, it was likely placed successfully.
          </p>
        )}
        <Link className="av-button-primary mt-10" to="/shop">
          Continue Shopping
        </Link>
      </div>
    </AnimatedPage>
  );
}

export default OrderConfirmation;