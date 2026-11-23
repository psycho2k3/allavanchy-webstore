import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import useWishlist from '../../hooks/useWishlist.js';
import { getImageUrl } from '../../services/mediaService.js';

const luxuryEase = [0.22, 1, 0.36, 1];

// Change to 'ZAR', 'EUR', 'GBP', etc.
const DEFAULT_CURRENCY = 'USD';

function formatPrice(value, currency = DEFAULT_CURRENCY) {
  // Already formatted text like "$120" or "R 1,200": leave it alone
  if (typeof value === 'string' && /[^\d.,\s-]/.test(value)) {
    return value;
  }

  const amount = Number(value);
  if (
    value === null ||
    value === undefined ||
    value === '' ||
    Number.isNaN(amount)
  ) {
    return '';
  }

  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function ProductCard({
  product = {},
  onFavorite,
  index = 0, // optional: pass the grid index for a staggered reveal
}) {
  const { requireAuth } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const {
    id,
    image,
    hoverImage, // optional second image shown on hover
    name = 'Product Name',
    category = 'Category',
    price = 0,
    currency, // optional, e.g. product.currency from your API
    badge, // optional: e.g. "New", "Limited"
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
      className="av-product-card group"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.8,
        ease: luxuryEase,
        delay: (index % 4) * 0.08,
      }}
    >
      <Link
        to={id ? `/products/${id}` : '/shop'}
        className="block focus:outline-none focus-visible:ring-1 focus-visible:ring-allavanchy-ink focus-visible:ring-offset-4"
        aria-label={`View ${name}`}
      >
        {/* Product image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-allavanchy-mist">
          {image ? (
            <>
              <img
                src={getImageUrl(image, { width: 700 })}
                alt={name}
                className={`absolute inset-0 h-full w-full object-cover object-center transition-[transform,opacity] duration-[1400ms] ease-luxury group-hover:scale-[1.04] ${
                  hoverImage ? 'group-hover:opacity-0' : ''
                }`}
                loading="lazy"
                decoding="async"
              />

              {hoverImage && (
                <img
                  src={getImageUrl(hoverImage, { width: 700 })}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full scale-[1.02] object-cover object-center opacity-0 transition-[transform,opacity] duration-[1400ms] ease-luxury group-hover:scale-100 group-hover:opacity-100"
                  loading="lazy"
                  decoding="async"
                />
              )}
            </>
          ) : (
            <div
              className="h-full w-full bg-allavanchy-mist"
              aria-hidden="true"
            />
          )}

          {/* Soft gradient so the hover cue reads cleanly */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-allavanchy-ink/25 to-transparent opacity-0 transition-opacity duration-700 ease-luxury group-hover:opacity-100"
            aria-hidden="true"
          />

          {/* Badge */}
          {badge && (
            <span className="absolute left-0 top-4 bg-allavanchy-ivory/95 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-allavanchy-ink">
              {badge}
            </span>
          )}

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
            whileTap={{ scale: 0.88 }}
            className={`absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-allavanchy-ivory/90 shadow-luxury-soft backdrop-blur-sm transition duration-500 ease-luxury hover:bg-allavanchy-ink hover:text-allavanchy-ivory
              ${favorited ? 'text-red-500 opacity-100' : 'text-allavanchy-ink'}
              opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100`}
          >
            <Heart
              aria-hidden="true"
              size={16}
              strokeWidth={1.25}
              fill={favorited ? 'currentColor' : 'none'}
            />
          </motion.button>

          {/* Hover cue */}
          <span
            className="pointer-events-none absolute inset-x-0 bottom-5 hidden translate-y-2 text-center text-[10px] font-medium uppercase tracking-[0.32em] text-allavanchy-ivory opacity-0 transition duration-700 ease-luxury group-hover:translate-y-0 group-hover:opacity-100 md:block"
            aria-hidden="true"
          >
            View piece
          </span>
        </div>

        {/* Product information */}
        <div className="px-0.5 pb-1 pt-5 text-center sm:text-left">
          <p className="av-caption">{category}</p>

          <h3 className="relative mt-2.5 inline-block text-[13px] font-medium uppercase tracking-luxury text-allavanchy-ink">
            {name}
            <span
              className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-allavanchy-ink transition-transform duration-700 ease-luxury group-hover:scale-x-100"
              aria-hidden="true"
            />
          </h3>

          <p className="mt-2.5 text-sm font-light tracking-wide text-allavanchy-graphite">
            {formatPrice(price, currency)}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}

export default ProductCard;