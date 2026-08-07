import { Link, useLocation } from 'react-router-dom';
import AnimatedPage from '../components/motion/AnimatedPage.jsx';

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <AnimatedPage className="bg-allavanchy-ivory pb-20 pt-28">
      <div className="av-container py-16 text-center">
        <h1 className="av-heading-xl">Thank You</h1>
        {order ? (
          <>
            <p className="av-body mx-auto mt-4 max-w-md">
              Your order has been placed successfully.
            </p>
            <div className="mx-auto mt-8 max-w-sm border border-allavanchy-stone bg-allavanchy-pearl p-6 text-left">
              <p className="text-sm text-allavanchy-graphite">Order Number</p>
              <p className="text-lg font-medium">#{order.id}</p>
              <p className="mt-4 text-sm text-allavanchy-graphite">Total</p>
              <p className="text-lg font-medium">{currencyFormatter.format(Number(order.total || 0))}</p>
              <p className="mt-4 text-sm text-allavanchy-graphite">Status</p>
              <p className="text-lg font-medium">{order.status || 'Pending'}</p>
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