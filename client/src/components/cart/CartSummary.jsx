import { Link, useNavigate } from 'react-router-dom';
import { formatMoney } from '../../utils/money.js';

function CartSummary({ currency, estimatedTax, grandTotal, shipping, subtotal }) {
  const navigate = useNavigate();

  return (
    <aside className="border border-allavanchy-stone bg-allavanchy-pearl p-6 shadow-luxury-soft lg:sticky lg:top-28 lg:self-start">
      <h2 className="av-heading-md">Order Summary</h2>

      <div className="mt-6 space-y-4 border-b border-allavanchy-stone pb-6 text-sm">
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

      <button className="av-button-primary mt-8 w-full" onClick={() => navigate('/checkout')} type="button">
        Proceed to Checkout
      </button>
      <Link className="av-button-secondary mt-3 w-full" to="/shop">
        Continue Shopping
      </Link>
    </aside>
  );
}

export default CartSummary;