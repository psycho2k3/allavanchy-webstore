import { Link } from 'react-router-dom';

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function CartSummary({ estimatedTax, grandTotal, shipping, subtotal }) {
  return (
    <aside className="border border-allavanchy-stone bg-allavanchy-pearl p-6 shadow-luxury-soft lg:sticky lg:top-28 lg:self-start">
      <h2 className="av-heading-md">Order Summary</h2>

      <div className="mt-6 space-y-4 border-b border-allavanchy-stone pb-6 text-sm">
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

      <button className="av-button-primary mt-8 w-full" type="button">
        Proceed to Checkout
      </button>
      <Link className="av-button-secondary mt-3 w-full" to="/shop">
        Continue Shopping
      </Link>
    </aside>
  );
}

export default CartSummary;
