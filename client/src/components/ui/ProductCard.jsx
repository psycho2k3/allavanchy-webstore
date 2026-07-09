import { Eye, Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart.js';
import { getImageUrl } from '../../services/mediaService.js';

function ProductCard({
  product = {},
  onAddToCart,
  onFavorite,
  onQuickView,
}) {
  const { addToCart } = useCart();
  const {
    id,
    image,
    hoverImage,
    name = 'Product Name',
    category = 'Category',
    price = '$0',
  } = product;

  const handleQuickView = () => {
    if (onQuickView) onQuickView(product);
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
      return;
    }

    addToCart(product);
  };

  const handleFavorite = () => {
    if (onFavorite) onFavorite(product);
  };

  return (
    <motion.article
      className="group av-product-card"
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: '-60px' }}
      whileHover={{ y: -4 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-allavanchy-mist">
        {image ? (
          <img
            alt={name}
            className="h-full w-full object-cover transition duration-700 ease-luxury group-hover:scale-105"
            src={getImageUrl(image)}
          />
        ) : null}

        {hoverImage ? (
          <img
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 ease-luxury group-hover:scale-105 group-hover:opacity-100"
            src={getImageUrl(hoverImage)}
          />
        ) : null}

        <motion.button
          aria-label={`Add ${name} to favorites`}
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-allavanchy-ivory/90 text-allavanchy-ink opacity-100 shadow-luxury-soft transition duration-300 ease-luxury hover:bg-allavanchy-ink hover:text-allavanchy-ivory md:opacity-0 md:group-hover:opacity-100"
          onClick={handleFavorite}
          type="button"
          whileTap={{ scale: 0.96 }}
        >
          <Heart aria-hidden="true" size={18} strokeWidth={1.5} />
        </motion.button>

        <div className="absolute inset-x-3 bottom-3 grid gap-2 opacity-100 transition duration-300 ease-luxury md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <Link
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-luxury bg-allavanchy-ivory px-4 text-[0.68rem] font-medium uppercase tracking-luxury text-allavanchy-ink transition duration-300 ease-luxury hover:bg-allavanchy-stone"
            onClick={handleQuickView}
            to={id ? `/products/${id}` : '/shop'}
          >
            <Eye aria-hidden="true" size={15} strokeWidth={1.5} />
            Quick View
          </Link>
          <motion.button
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-luxury bg-allavanchy-ink px-4 text-[0.68rem] font-medium uppercase tracking-luxury text-allavanchy-ivory transition duration-300 ease-luxury hover:bg-allavanchy-graphite"
            onClick={handleAddToCart}
            type="button"
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingBag aria-hidden="true" size={15} strokeWidth={1.5} />
            Add to Cart
          </motion.button>
        </div>
      </div>

      <div className="pt-4">
        <p className="av-caption">{category}</p>
        <div className="mt-2 flex items-start justify-between gap-4">
          <h3 className="text-sm font-medium uppercase tracking-luxury text-allavanchy-ink">
            {name}
          </h3>
          <p className="shrink-0 text-sm text-allavanchy-graphite">{price}</p>
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;
