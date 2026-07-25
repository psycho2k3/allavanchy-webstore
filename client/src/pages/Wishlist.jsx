import { Link } from 'react-router-dom';
import AnimatedPage from '../components/motion/AnimatedPage.jsx';
import useCart from '../hooks/useCart.js';
import useWishlist from '../hooks/useWishlist.js';
import { getImageUrl } from '../services/mediaService.js';

function Wishlist() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <AnimatedPage className="bg-allavanchy-ivory pb-20 pt-28">
      <div className="av-container">
        <div className="flex flex-col justify-between gap-6 border-b border-allavanchy-stone pb-8 md:flex-row md:items-end">
          <div>
            <p className="av-eyebrow">Wishlist</p>
            <h1 className="av-heading-xl mt-3">Saved Pieces</h1>
          </div>
          {wishlistItems.length > 0 ? (
            <button className="av-button-secondary self-start" onClick={clearWishlist} type="button">
              Clear Wishlist
            </button>
          ) : null}
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid gap-x-5 gap-y-10 py-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map((item) => (
              <article className="group" key={item.id}>
                <Link className="block overflow-hidden bg-allavanchy-mist" to={`/products/${item.id}`}>
                  <img
                    alt={item.name}
                    className="aspect-[3/4] h-full w-full object-cover transition duration-700 ease-luxury group-hover:scale-105"
                    src={getImageUrl(item.image)}
                  />
                </Link>
                <div className="pt-4">
                  <p className="av-caption">{item.category}</p>
                  <div className="mt-2 flex items-start justify-between gap-4">
                    <Link
                      className="text-sm font-medium uppercase tracking-luxury text-allavanchy-ink"
                      to={`/products/${item.id}`}
                    >
                      {item.name}
                    </Link>
                    <p className="shrink-0 text-sm text-allavanchy-graphite">{item.price}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="av-button-primary flex-1" onClick={() => addToCart(item)} type="button">
                    Add to Cart
                  </button>
                  <button
                    className="av-button-secondary"
                    onClick={() => removeFromWishlist(item.id)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl py-20 text-center">
            <h2 className="av-heading-lg">Your wishlist is empty</h2>
            <p className="av-body mx-auto mt-4 max-w-md">
              Save the pieces you love and find them here whenever you're ready.
            </p>
            <Link className="av-button-primary mt-8" to="/shop">
              Explore the Collection
            </Link>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}

export default Wishlist;