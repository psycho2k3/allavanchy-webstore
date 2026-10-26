import { useEffect, useState } from 'react';
import AnimatedPage from '../components/motion/AnimatedPage.jsx';
import { DEFAULT_CART_SIZE } from '../context/CartContext.jsx';
import useCart from '../hooks/useCart.js';
import { getApiErrorMessage } from '../services/apiClient.js';
import { createOrder } from '../services/orderApi.js';
import { redirectToPayment } from '../services/paymentApi.js';
import { formatMoney } from '../utils/money.js';
import { clearPendingOrder, readPendingOrder, savePendingOrder } from '../utils/pendingOrder.js';

const getOrderSize = (item) => (item.size && item.size !== DEFAULT_CART_SIZE ? item.size : null);

const getCartSignature = (cartItems) =>
  JSON.stringify(cartItems.map((item) => [item.id, item.size, item.quantity]));

function Checkout() {
  const { cartItems, currency, subtotal, shipping, estimatedTax, grandTotal, refreshCartItems } = useCart();
  const [form, setForm] = useState({ name: '', address: '', city: '', postalCode: '', phone: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Make sure the summary shows current prices and stock before paying.
  useEffect(() => {
    refreshCartItems();
  }, [refreshCartItems]);

  // Returning from Paystack via the back button can restore this page from the
  // bfcache with the button still stuck on "Redirecting...".
  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) setIsSubmitting(false);
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const updateField = (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  };

  const submitOrder = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const signature = getCartSignature(cartItems);
    const pendingOrder = readPendingOrder();

    // Same cart as the last unpaid attempt: pay for that order again.
    if (pendingOrder?.orderId && pendingOrder.signature === signature) {
      try {
        await redirectToPayment(pendingOrder.orderId);
        return;
      } catch (paymentError) {
        clearPendingOrder();

        // 404 means the order is not ours (e.g. a different account in this tab):
        // fall through and create a fresh order. Anything else is shown as-is.
        if (paymentError.response?.status !== 404) {
          setError(getApiErrorMessage(paymentError, 'Unable to start payment. Please try again from My Orders.'));
          setIsSubmitting(false);
          return;
        }
      }
    }

    try {
      const order = await createOrder({
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          size: getOrderSize(item),
        })),
        shipping: {
          name: form.name,
          address: form.address,
          city: form.city,
          postal_code: form.postalCode,
          phone: form.phone,
        },
      });

      savePendingOrder(order.id, signature);

      try {
        // The cart is cleared once Paystack confirms payment (see PaymentCallback).
        await redirectToPayment(order.id);
      } catch (paymentError) {
        setError(
          `Order #${order.id} was created, but payment could not be started: ` +
            getApiErrorMessage(paymentError, 'please try again from My Orders.'),
        );
        setIsSubmitting(false);
      }
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to place your order'));
      setIsSubmitting(false);

      // Insufficient stock: pull the latest stock levels into the cart.
      if (requestError.response?.status === 409) {
        refreshCartItems();
      }
    }
  };

  if (cartItems.length === 0) {
    return (
      <AnimatedPage className="bg-allavanchy-ivory pb-20 pt-28">
        <div className="av-container py-20 text-center">
          <h1 className="av-heading-lg">Your cart is empty</h1>
          <p className="av-body mx-auto mt-4 max-w-md">Add something to your cart before checking out.</p>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="bg-allavanchy-ivory pb-20 pt-28">
      <div className="av-container">
        <div className="border-b border-allavanchy-stone pb-8">
          <p className="av-eyebrow">Checkout</p>
          <h1 className="av-heading-xl mt-3">Shipping Details</h1>
        </div>

        <div className="grid gap-10 py-8 lg:grid-cols-[1fr_380px]">
          <form className="space-y-5" onSubmit={submitOrder}>
            {error && (
              <p className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
            )}

            <label className="block">
              <span className="av-caption">Full name</span>
              <input className="av-input mt-2" name="name" onChange={updateField} required type="text" value={form.name} />
            </label>

            <label className="block">
              <span className="av-caption">Address</span>
              <input className="av-input mt-2" name="address" onChange={updateField} required type="text" value={form.address} />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="av-caption">City</span>
                <input className="av-input mt-2" name="city" onChange={updateField} required type="text" value={form.city} />
              </label>

              <label className="block">
                <span className="av-caption">Postal code</span>
                <input className="av-input mt-2" name="postalCode" onChange={updateField} type="text" value={form.postalCode} />
              </label>
            </div>

            <label className="block">
              <span className="av-caption">Phone</span>
              <input className="av-input mt-2" name="phone" onChange={updateField} required type="tel" value={form.phone} />
            </label>

            <button className="av-button-primary w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Redirecting to payment...' : 'Continue to Payment'}
            </button>
          </form>

          <aside className="border border-allavanchy-stone bg-allavanchy-pearl p-6 shadow-luxury-soft lg:sticky lg:top-28 lg:self-start">
            <h2 className="av-heading-md">Order Summary</h2>

            <div className="mt-6 space-y-3 border-b border-allavanchy-stone pb-6 text-sm">
              {cartItems.map((item) => (
                <div className="flex justify-between gap-4" key={item.cartItemId}>
                  <span className="text-allavanchy-graphite">
                    {item.name}
                    {getOrderSize(item) ? ` (${item.size})` : ''} × {item.quantity}
                  </span>
                  <span>{formatMoney(item.price * item.quantity, currency)}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 border-b border-allavanchy-stone pb-6 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-allavanchy-graphite">Subtotal</span>
                <span>{formatMoney(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-allavanchy-graphite">Shipping</span>
                <span>{formatMoney(shipping, currency)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-allavanchy-graphite">Estimated Tax</span>
                <span>{formatMoney(estimatedTax, currency)}</span>
              </div>
            </div>

            <div className="mt-5 flex justify-between gap-4 text-base font-medium">
              <span>Grand Total</span>
              <span>{formatMoney(grandTotal, currency)}</span>
            </div>

            <p className="mt-4 text-xs text-allavanchy-graphite">
              You will be redirected to Paystack to pay securely.
            </p>
          </aside>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default Checkout;