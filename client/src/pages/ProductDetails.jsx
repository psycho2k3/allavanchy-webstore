import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Minus, Plus } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AnimatedPage from '../components/motion/AnimatedPage.jsx';
import ProductCard from '../components/ui/ProductCard.jsx';
import { getMaxQuantity } from '../context/CartContext.jsx';
import useCart from '../hooks/useCart.js';
import useAuth from '../hooks/useAuth.js';
import useWishlist from '../hooks/useWishlist.js';
import { getAllProducts, getProductById, normalizeProduct } from '../services/productApi.js';
import { getApiErrorMessage } from '../services/apiClient.js';
import { getImageUrl } from '../services/mediaService.js';
import { formatMoney } from '../utils/money.js';

const luxuryEase = [0.22, 1, 0.36, 1];
const LOW_STOCK_THRESHOLD = 5;

function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('One Size');
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const addedTimer = useRef(null);

  const { addToCart, currency } = useCart();
  const { requireAuth } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const [productData, allProductsData] = await Promise.all([
          getProductById(productId),
          getAllProducts(),
        ]);

        if (cancelled) return;

        const normalized = normalizeProduct(productData);
        const normalizedList = (
          Array.isArray(allProductsData) ? allProductsData : allProductsData.data || []
        ).map(normalizeProduct);

        setProduct(normalized);
        setAllProducts(normalizedList);
        setActiveImage(normalized.gallery[0] || normalized.image);
        setSelectedSize(normalized.sizes[0] || 'One Size');
        setQuantity(1);
      } catch (error) {
        if (!cancelled) setLoadError(getApiErrorMessage(error, 'Product not found'));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadProduct();
    window.scrollTo({ top: 0 });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  useEffect(() => () => clearTimeout(addedTimer.current), []);

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    const sameCategory = allProducts.filter(
      (item) => item.id !== product.id && item.category === product.category,
    );

    if (sameCategory.length > 0) return sameCategory.slice(0, 4);

    return allProducts.filter((item) => item.id !== product.id).slice(0, 4);
  }, [allProducts, product]);

  if (isLoading) {
    return (
      <AnimatedPage className="bg-allavanchy-ivory pb-20 pt-28">
        <div className="av-container">
          <div className="grid animate-pulse gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="grid gap-4 md:grid-cols-[88px_1fr]">
              <div className="hidden space-y-3 md:block">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="aspect-[3/4] w-full bg-allavanchy-mist" />
                ))}
              </div>
              <div className="aspect-[3/4] w-full bg-allavanchy-mist" />
            </div>
            <div className="space-y-4 p-6 md:p-8">
              <div className="h-3 w-24 bg-allavanchy-mist" />
              <div className="h-8 w-3/4 bg-allavanchy-mist" />
              <div className="h-4 w-20 bg-allavanchy-mist" />
              <div className="h-24 w-full bg-allavanchy-mist" />
            </div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  if (loadError || !product) {
    return (
      <AnimatedPage className="bg-allavanchy-ivory pb-20 pt-28">
        <title>Product not found | ALLAVANCHY</title>
        <div className="av-container py-20 text-center">
          <h2 className="av-heading-lg">Product not found</h2>
          <p className="av-body mx-auto mt-4 max-w-md">
            {loadError || 'This piece may have been removed or is no longer available.'}
          </p>
          <Link className="av-button-primary mt-8" to="/shop">
            Back to Shop
          </Link>
        </div>
      </AnimatedPage>
    );
  }

  const gallery = product.gallery.length ? product.gallery : [product.image];
  const maxQuantity = Math.max(1, getMaxQuantity(product.stock));
  const outOfStock = product.stock === 0;
  const lowStock = !outOfStock && product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD;
  const favorited = product.id ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    requireAuth(() => {
      addToCart(product, quantity, selectedSize);
      setJustAdded(true);
      clearTimeout(addedTimer.current);
      addedTimer.current = setTimeout(() => setJustAdded(false), 2200);
    });
  };

  const handleFavorite = () => {
    requireAuth(() => toggleWishlist(product));
  };

  return (
    <AnimatedPage className="bg-allavanchy-ivory pb-24 pt-28">
      <title>{`${product.name} | ALLAVANCHY`}</title>

      <div className="av-container">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-2 text-[10px] font-medium uppercase tracking-[0.28em] text-allavanchy-graphite"
        >
          <Link className="transition-colors duration-500 hover:text-allavanchy-ink" to="/shop">
            Shop
          </Link>
          <span aria-hidden="true">/</span>
          <span>{product.category}</span>
          <span aria-hidden="true">/</span>
          <span className="text-allavanchy-ink">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: luxuryEase }}
          >
            <div className="grid gap-4 md:grid-cols-[88px_1fr]">
              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:grid md:content-start md:overflow-visible">
                  {gallery.map((image) => (
                    <button
                      aria-label={`View ${product.name} image`}
                      aria-pressed={activeImage === image}
                      className={`aspect-[3/4] w-20 shrink-0 overflow-hidden border bg-allavanchy-mist transition duration-500 ease-luxury md:w-full ${
                        activeImage === image
                          ? 'border-allavanchy-ink'
                          : 'border-transparent opacity-70 hover:border-allavanchy-ash hover:opacity-100'
                      }`}
                      key={image}
                      onClick={() => setActiveImage(image)}
                      type="button"
                    >
                      <img
                        alt=""
                        className="h-full w-full object-cover object-center"
                        loading="lazy"
                        src={getImageUrl(image, { width: 240 })}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div
                className={`group relative order-1 aspect-[3/4] w-full overflow-hidden bg-allavanchy-mist ${
                  gallery.length > 1 ? 'md:order-2' : 'md:col-span-2'
                }`}
              >
                <div className="h-full w-full transition-transform duration-[1400ms] ease-luxury group-hover:scale-[1.04]">
                  <AnimatePresence initial={false} mode="wait">
                    <motion.img
                      alt={product.name}
                      animate={{ opacity: 1 }}
                      className="h-full w-full object-cover object-center"
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0 }}
                      key={activeImage}
                      src={getImageUrl(activeImage, { width: 1200 })}
                      transition={{ duration: 0.45, ease: luxuryEase }}
                    />
                  </AnimatePresence>
                </div>

                {product.badge && (
                  <span className="absolute left-0 top-5 bg-allavanchy-ivory/95 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-allavanchy-ink">
                    {product.badge}
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Product panel */}
          <motion.aside
            className="lg:sticky lg:top-28 lg:self-start"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: luxuryEase, delay: 0.12 }}
          >
            <div className="border border-allavanchy-stone bg-allavanchy-pearl p-6 shadow-luxury-soft md:p-10">
              <p className="av-eyebrow">{product.category}</p>
              <h1 className="av-heading-lg mt-3">{product.name}</h1>

              <div className="mt-5 flex items-center justify-between gap-4">
                <p className="text-lg font-light tracking-wide text-allavanchy-graphite">
                  {formatMoney(product.price, currency)}
                </p>

                {lowStock && (
                  <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-allavanchy-graphite">
                    Only {product.stock} left
                  </p>
                )}
              </div>

              <div className="my-7 h-px w-full bg-allavanchy-stone" />

              <p className="av-body">{product.description}</p>

              {product.sizes.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <p className="av-caption">
                      Size <span className="text-allavanchy-ink">· {selectedSize}</span>
                    </p>
                    <Link className="av-link text-xs uppercase tracking-luxury" to="/faq">
                      Size Guide
                    </Link>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        aria-pressed={selectedSize === size}
                        className={`min-h-11 border text-xs uppercase tracking-luxury transition duration-500 ease-luxury ${
                          selectedSize === size
                            ? 'border-allavanchy-ink bg-allavanchy-ink text-allavanchy-ivory'
                            : 'border-allavanchy-stone text-allavanchy-graphite hover:border-allavanchy-ink hover:text-allavanchy-ink'
                        }`}
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        type="button"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-8">
                <p className="av-caption">Quantity</p>
                <div className="mt-3 inline-flex min-h-11 items-center border border-allavanchy-stone">
                  <button
                    aria-label="Decrease quantity"
                    className="inline-flex h-11 w-11 items-center justify-center transition duration-500 hover:bg-allavanchy-mist disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    type="button"
                  >
                    <Minus aria-hidden="true" size={15} strokeWidth={1.25} />
                  </button>
                  <span aria-live="polite" className="min-w-12 text-center text-sm">
                    {quantity}
                  </span>
                  <button
                    aria-label="Increase quantity"
                    className="inline-flex h-11 w-11 items-center justify-center transition duration-500 hover:bg-allavanchy-mist disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={quantity >= maxQuantity}
                    onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
                    type="button"
                  >
                    <Plus aria-hidden="true" size={15} strokeWidth={1.25} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex gap-3">
                <button
                  className="av-button-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={outOfStock}
                  onClick={handleAddToCart}
                  type="button"
                >
                  {outOfStock ? 'Out of Stock' : justAdded ? 'Added to Cart' : 'Add to Cart'}
                </button>

                <motion.button
                  aria-label={
                    favorited
                      ? `Remove ${product.name} from favorites`
                      : `Add ${product.name} to favorites`
                  }
                  aria-pressed={favorited}
                  className={`inline-flex h-auto w-14 shrink-0 items-center justify-center border border-allavanchy-stone transition duration-500 ease-luxury hover:border-allavanchy-ink hover:bg-allavanchy-ink hover:text-allavanchy-ivory ${
                    favorited ? 'text-red-500' : 'text-allavanchy-ink'
                  }`}
                  onClick={handleFavorite}
                  type="button"
                  whileTap={{ scale: 0.92 }}
                >
                  <Heart
                    aria-hidden="true"
                    fill={favorited ? 'currentColor' : 'none'}
                    size={17}
                    strokeWidth={1.25}
                  />
                </motion.button>
              </div>

              {/* Details */}
              <div className="mt-8 border-t border-allavanchy-stone">
                <details className="group border-b border-allavanchy-stone py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-medium uppercase tracking-[0.28em] text-allavanchy-ink [&::-webkit-details-marker]:hidden">
                    Shipping &amp; Returns
                    <Plus
                      aria-hidden="true"
                      className="transition-transform duration-500 ease-luxury group-open:rotate-45"
                      size={14}
                      strokeWidth={1.25}
                    />
                  </summary>
                  <p className="mt-3 text-sm text-allavanchy-graphite">
                    Complimentary returns within 14 days.
                  </p>
                </details>
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <section className="av-section pb-0">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="av-eyebrow">Related Products</p>
                <h2 className="av-heading-lg mt-3">Complete the Edit</h2>
              </div>
              <Link className="av-link text-sm uppercase tracking-luxury" to="/shop">
                View all pieces
              </Link>
            </div>

            <div className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item, index) => (
                <ProductCard index={index} key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </AnimatedPage>
  );
}

export default ProductDetails;