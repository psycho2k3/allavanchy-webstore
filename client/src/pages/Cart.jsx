import { Link } from 'react-router-dom';
import CartItem from '../components/cart/CartItem.jsx';
import CartSummary from '../components/cart/CartSummary.jsx';
import AnimatedPage from '../components/motion/AnimatedPage.jsx';
import useCart from '../hooks/useCart.js';

function Cart() {
  const {
    cartItems,
    clearCart,
    decreaseQuantity,
    estimatedTax,
    grandTotal,
    increaseQuantity,
    removeItem,
    shipping,
    subtotal,
  } = useCart();

  return (
    <AnimatedPage className="bg-allavanchy-ivory pb-20 pt-28">
      <div className="av-container">
        <div className="flex flex-col justify-between gap-6 border-b border-allavanchy-stone pb-8 md:flex-row md:items-end">
          <div>
            <p className="av-eyebrow">Shopping Cart</p>
            <h1 className="av-heading-xl mt-3">Your Selection</h1>
          </div>
          {cartItems.length > 0 ? (
            <button className="av-button-secondary self-start" onClick={clearCart} type="button">
              Clear Cart
            </button>
          ) : null}
        </div>

        {cartItems.length > 0 ? (
          <div className="grid gap-10 py-8 lg:grid-cols-[1fr_380px]">
            <div>
              {cartItems.map((item) => (
                <CartItem
                  item={item}
                  key={item.cartItemId}
                  onDecrease={() => decreaseQuantity(item.cartItemId)}
                  onIncrease={() => increaseQuantity(item.cartItemId)}
                  onRemove={() => removeItem(item.cartItemId)}
                />
              ))}
            </div>

            <CartSummary
              estimatedTax={estimatedTax}
              grandTotal={grandTotal}
              shipping={shipping}
              subtotal={subtotal}
            />
          </div>
        ) : (
          <div className="mx-auto max-w-2xl py-20 text-center">
            <h2 className="av-heading-lg">Your cart is empty</h2>
            <p className="av-body mx-auto mt-4 max-w-md">
              Explore the latest ALLAVANCHY pieces and add your selections when you are ready.
            </p>
            <Link className="av-button-primary mt-8" to="/shop">
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}

export default Cart;
