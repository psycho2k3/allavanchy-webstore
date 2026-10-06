import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import useWishlist from '../../hooks/useWishlist.js';
import { getImageUrl } from '../../services/mediaService.js';

function ProductCard({
  product = {},
  onFavorite,
}) {
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

  const handleFavorite = (event) => {
    // Prevent the wishlist button from opening the product page.
    event.preventDefault();
    event.stopPropagation();

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
      whileHover={{ y: -3 }}
      viewport={{
        once: true,
        margin: '-60px',
      }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        to={id ? `/products/${id}` : '/shop'}
        className="block"
        aria-label={`View ${name}`}
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

          {/* Wishlist */}
          <motion.button
            type="button"
            aria-label={
              favorited
                ? `Remove ${name} from favorites`
                : `Add ${name} to favorites`
            }
            aria-pressed={favorited}
            onClick={handleFavorite}
            whileTap={{ scale: 0.9 }}
            className={`absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-allavanchy-ivory/90 text-allavanchy-ink shadow-luxury-soft backdrop-blur-sm transition duration-300 ease-luxury hover:bg-allavanchy-ink hover:text-allavanchy-ivory ${
              favorited ? 'text-red-500' : ''
            }`}
          >
            <Heart
              aria-hidden="true"
              size={17}
              strokeWidth={1.5}
              fill={favorited ? 'currentColor' : 'none'}
            />
          </motion.button>
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
      </Link>
    </motion.article>
  );
}

export default ProductCard;
