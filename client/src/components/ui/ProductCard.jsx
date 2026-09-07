import { Eye, Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import useCart from '../../hooks/useCart.js';
import useWishlist from '../../hooks/useWishlist.js';
import { getImageUrl } from '../../services/mediaService.js';

function ProductCard({
  product = {},
  onAddToCart,
  onFavorite,
  onQuickView,
}) {
  const { addToCart } = useCart();
  const { requireAuth } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const {
    id,
    image,
    hoverImage,
    name = 'Product Name',
    category = 'Category',
    price = '$0',
  } = product;

  const handleQuickView = () => {
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const handleAddToCart = () => {
    requireAuth(() => {
      if (onAddToCart) {
        onAddToCart(product);
        return;
      }

      addToCart(product);
    });
  };

  const handleFavorite = () => {
    requireAuth(() => {
      if (onFavorite) {
        onFavorite(product);
        return;
      }

      toggleWishlist(product);
    });
  };

  const favorited = id ? isInWishlist(id) : false;

  return (
    <motion.article
      className="group av-product-card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      viewport={{
        once: true,
        margin: '-60px',
      }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Product image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-allavanchy-mist">
        {image ? (
          <img
            src={getImageUrl(image, {
              width: 700,
            })}
            alt={name}
            className="h-full w-full object-cover object-center transition duration-700 ease-luxury group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className="h-full w-full bg-allavanchy-mist"
            aria-hidden="true"
          />
        )}

        {/* Hover image */}
        {hoverImage ? (
          <img
            src={getImageUrl(hoverImage, {
              width: 700,
            })}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition duration-700 ease-luxury group-hover:scale-105 group-hover:opacity-100"
            loading="lazy"
            decoding="async"
          />
        ) : null}

        {/* Favorite */}
        <motion.button
          type="button"
          aria-label={`Add ${name} to favorites`}
          onClick={handleFavorite}
          whileTap={{ scale: 0.96 }}
          className={`absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-allavanchy-ivory/90 text-allavanchy-ink shadow-luxury-soft transition duration-300 ease-luxury hover:bg-allavanchy-ink hover:text-allavanchy-ivory md:opacity-0 md:group-hover:opacity-100 ${
            favorited
              ? 'text-red-500 opacity-100'
              : 'opacity-100'
          }`}
        >
          <Heart
            aria-hidden="true"
            size={18}
            strokeWidth={1.5}
            fill={favorited ? 'currentColor' : 'none'}
          />
        </motion.button>

        {/* Product actions */}
        <div className="absolute inset-x-3 bottom-3 grid gap-2 opacity-100 transition duration-300 ease-luxury md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <Link
            to={id ? `/products/${id}` : '/shop'}
            onClick={handleQuickView}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-luxury bg-allavanchy-ivory px-4 text-[0.68rem] font-medium uppercase tracking-luxury text-allavanchy-ink transition duration-300 ease-luxury hover:bg-allavanchy-stone"
          >
            <Eye
              aria-hidden="true"
              size={15}
              strokeWidth={1.5}
            />

            Quick View
          </Link>

          <motion.button
            type="button"
            onClick={handleAddToCart}
            whileTap={{ scale: 0.98 }}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-luxury bg-allavanchy-ink px-4 text-[0.68rem] font-medium uppercase tracking-luxury text-allavanchy-ivory transition duration-300 ease-luxury hover:bg-allavanchy-graphite"
          >
            <ShoppingBag
              aria-hidden="true"
              size={15}
              strokeWidth={1.5}
            />

            Add to Cart
          </motion.button>
        </div>
      </div>

      {/* Product information */}
      <div className="pt-4">
        <p className="av-caption">
          {category}
        </p>

        <div className="mt-2 flex items-start justify-between gap-3 sm:gap-4">
          <h3 className="text-sm font-medium uppercase tracking-luxury text-allavanchy-ink">
            {name}
          </h3>

          <p className="shrink-0 text-sm text-allavanchy-graphite">
            {price}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;