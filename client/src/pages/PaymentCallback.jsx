import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AnimatedPage from '../components/motion/AnimatedPage.jsx';
import useCart from '../hooks/useCart.js';
import { getApiErrorMessage } from '../services/apiClient.js';
import { verifyPayment } from '../services/paymentApi.js';
import { clearPendingOrder, readPendingOrder } from '../utils/pendingOrder.js';

// Paystack sends the customer back here with ?reference=... after payment.
function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [message, setMessage] = useState('Confirming your payment...');
  const [failed, setFailed] = useState(false);
  const hasVerified = useRef(false);

  const reference = searchParams.get('reference') || searchParams.get('trxref');

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    if (!reference) {
      setFailed(true);
      setMessage('No payment reference was found.');
      return;
    }

    verifyPayment(reference)
      .then((result) => {
        if (result.paid) {
          // Only empty the cart when this payment was for the order built from it;
          // paying an older order from My Orders must not wipe the current cart.
          const pendingOrder = readPendingOrder();

          if (pendingOrder && result.order && String(pendingOrder.orderId) === String(result.order.id)) {
            clearCart();
            clearPendingOrder();
          }

          navigate('/order-confirmation', { replace: true, state: { order: result.order } });
        } else {
          setFailed(true);
          setMessage('Your payment was not completed.');
        }
      })
      .catch((error) => {
        setFailed(true);
        setMessage(getApiErrorMessage(error, 'Your payment was not completed.'));
      });
  }, [reference, clearCart, navigate]);

  return (
    <AnimatedPage className="bg-allavanchy-ivory pb-20 pt-28">
      <div className="av-container py-16 text-center">
        <h1 className="av-heading-xl">{failed ? 'Payment Not Completed' : 'Processing Payment'}</h1>
        <p className="av-body mx-auto mt-4 max-w-md">{message}</p>
        {failed && (
          <>
            <p className="av-body mx-auto mt-2 max-w-md">
              Your order has been saved. You can try paying again from My Orders.
            </p>
            <Link className="av-button-primary mt-10" to="/orders">
              Go to My Orders
            </Link>
          </>
        )}
      </div>
    </AnimatedPage>
  );
}

export default PaymentCallback;
