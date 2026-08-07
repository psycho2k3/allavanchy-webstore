import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '../components/motion/AnimatedPage.jsx';
import useCart from '../hooks/useCart.js';
import { createOrder } from '../services/orderApi.js';

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, subtotal, shipping, estimatedTax, grandTotal, clearCart } = useCart();
  const [form, setForm] = useState({ name: '', address: '', city: '', postalCode: '', phone: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    try {
      const order = await createOrder({
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        shipping: {
          name: form.name,
          address: form.address,
          city: form.city,
          postal_code: form.postalCode,
          phone: form.phone,
        },
      });

      clearCart();
      navigate('/order-confirmation', { state: { order } });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to place your order');
    } finally {
      setIsSubmitting(false);
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
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>

          <aside className="border border-allavanchy-stone bg-allavanchy-pearl p-6 shadow-luxury-soft lg:sticky lg:top-28 lg:self-start">
            <h2 className="av-heading-md">Order Summary</h2>

            <div className="mt-6 space-y-3 border-b border-allavanchy-stone pb-6 text-sm">
              {cartItems.map((item) => (
                <div className="flex justify-between gap-4" key={item.cartItemId}>
                  <span className="text-allavanchy-graphite">
                    {item.name} × {item.quantity}
                  </span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 border-b border-allavanchy-stone pb-6 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-allavanchy-graphite">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-allavanchy-graphite">Shipping</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-allavanchy-graphite">Estimated Tax</span>
                <span>{formatCurrency(estimatedTax)}</span>
              </div>
            </div>

            <div className="mt-5 flex justify-between gap-4 text-base font-medium">
              <span>Grand Total</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </aside>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default Checkout;