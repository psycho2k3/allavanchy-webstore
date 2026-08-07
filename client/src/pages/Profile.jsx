import { Link } from 'react-router-dom';
import AnimatedPage from '../components/motion/AnimatedPage.jsx';
import useAuth from '../hooks/useAuth.js';
import useCart from '../hooks/useCart.js';
import useWishlist from '../hooks/useWishlist.js';
import { getImageUrl } from '../services/mediaService.js';

function Profile() {
  const { user, logout } = useAuth();
  const { cartItems, subtotal } = useCart();
  const { wishlistItems } = useWishlist();

  return (
    <AnimatedPage className="bg-allavanchy-ivory pb-20 pt-28">
      <div className="av-container">
        <div className="flex flex-col justify-between gap-6 border-b border-allavanchy-stone pb-8 md:flex-row md:items-end">
          <div>
            <p className="av-eyebrow">My Account</p>
            <h1 className="av-heading-xl mt-3">{user?.name}</h1>
            <p className="av-body mt-2 text-sm">{user?.email}</p>
          </div>
          <button className="av-button-secondary self-start" onClick={logout} type="button">
            Sign Out
          </button>
        </div>

        <div className="py-6">
          <Link className="av-link text-sm uppercase tracking-luxury" to="/orders">
            View My Orders
          </Link>
        </div>

        <div className="grid gap-10 py-4 lg:grid-cols-2">
          <section>
            <div className="flex items-center justify-between">
              <h2 className="av-heading-md">Your Cart</h2>
              <Link className="av-link text-xs uppercase tracking-luxury" to="/cart">
                View Cart
              </Link>
            </div>

            {cartItems.length > 0 ? (
              <div className="mt-6 space-y-4">
                {cartItems.map((item) => (
                  <div className="flex items-center gap-4 border-b border-allavanchy-stone pb-4" key={item.cartItemId}>
                    <img
                      alt={item.name}
                      className="h-16 w-16 shrink-0 object-cover"
                      src={getImageUrl(item.image)}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium uppercase tracking-luxury text-allavanchy-ink">
                        {item.name}
                      </p>
                      <p className="mt-1 text-sm text-allavanchy-graphite">
                        Qty {item.quantity} · ${item.price}
                      </p>
                    </div>
                  </div>
                ))}
                <p className="text-sm font-medium text-allavanchy-ink">Subtotal: ${subtotal.toFixed(2)}</p>
              </div>
            ) : (
              <p className="av-body mt-6 text-sm">Your cart is empty.</p>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between">
              <h2 className="av-heading-md">Your Wishlist</h2>
              <Link className="av-link text-xs uppercase tracking-luxury" to="/wishlist">
                View Wishlist
              </Link>
            </div>

            {wishlistItems.length > 0 ? (
              <div className="mt-6 space-y-4">
                {wishlistItems.map((item) => (
                  <div className="flex items-center gap-4 border-b border-allavanchy-stone pb-4" key={item.id}>
                    <img
                      alt={item.name}
                      className="h-16 w-16 shrink-0 object-cover"
                      src={getImageUrl(item.image)}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium uppercase tracking-luxury text-allavanchy-ink">
                        {item.name}
                      </p>
                      <p className="mt-1 text-sm text-allavanchy-graphite">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="av-body mt-6 text-sm">Your wishlist is empty.</p>
            )}
          </section>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default Profile;