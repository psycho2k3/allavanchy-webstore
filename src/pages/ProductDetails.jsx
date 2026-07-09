import { Minus, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AnimatedPage from '../components/motion/AnimatedPage.jsx';
import ProductCard from '../components/ui/ProductCard.jsx';
import products from '../data/products.js';
import useCart from '../hooks/useCart.js';
import { getImageUrl } from '../services/mediaService.js';

function ProductDetails() {
  const { productId } = useParams();
  const product = products.find((item) => item.id === productId) || products[0];
  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const [activeImage, setActiveImage] = useState(gallery[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'One Size');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const relatedProducts = useMemo(
    () =>
      products
        .filter((item) => item.id !== product.id && item.category === product.category)
        .slice(0, 4),
    [product.category, product.id],
  );

  const fallbackRelatedProducts = relatedProducts.length
    ? relatedProducts
    : products.filter((item) => item.id !== product.id).slice(0, 4);

  return (
    <AnimatedPage className="bg-allavanchy-ivory pb-20 pt-28">
      <div className="av-container">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="grid gap-4 md:grid-cols-[88px_1fr]">
              <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:grid md:content-start md:overflow-visible">
                {gallery.map((image) => (
                  <button
                    aria-label={`View ${product.name} image`}
                    className={`aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-luxury border bg-allavanchy-mist transition duration-300 ease-luxury md:w-full ${
                      activeImage === image ? 'border-allavanchy-ink' : 'border-transparent hover:border-allavanchy-ash'
                    }`}
                    key={image}
                    onClick={() => setActiveImage(image)}
                    type="button"
                  >
                    <img alt="" className="h-full w-full object-cover" src={getImageUrl(image)} />
                  </button>
                ))}
              </div>

              <div className="order-1 overflow-hidden rounded-luxury bg-allavanchy-mist md:order-2">
                <img
                  alt={product.name}
                  className="aspect-[3/4] h-full w-full object-cover"
                  src={getImageUrl(activeImage)}
                />
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-allavanchy-stone bg-allavanchy-pearl p-6 shadow-luxury-soft md:p-8">
              <p className="av-eyebrow">{product.category}</p>
              <h1 className="av-heading-lg mt-3">{product.name}</h1>
              <p className="mt-4 text-lg text-allavanchy-graphite">${product.price}</p>
              <p className="av-body mt-6">{product.description}</p>

              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <p className="av-caption">Size</p>
                  <Link className="av-link text-xs uppercase tracking-luxury" to="/faq">
                    Size Guide
                  </Link>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {product.sizes?.map((size) => (
                    <button
                      className={`min-h-11 rounded-luxury border text-xs uppercase tracking-luxury transition duration-300 ease-luxury ${
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

              <div className="mt-8">
                <p className="av-caption">Quantity</p>
                <div className="mt-3 inline-flex min-h-11 items-center border border-allavanchy-stone">
                  <button
                    aria-label="Decrease quantity"
                    className="inline-flex h-11 w-11 items-center justify-center transition hover:bg-allavanchy-mist"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    type="button"
                  >
                    <Minus aria-hidden="true" size={15} strokeWidth={1.5} />
                  </button>
                  <span className="min-w-12 text-center text-sm">{quantity}</span>
                  <button
                    aria-label="Increase quantity"
                    className="inline-flex h-11 w-11 items-center justify-center transition hover:bg-allavanchy-mist"
                    onClick={() => setQuantity((value) => value + 1)}
                    type="button"
                  >
                    <Plus aria-hidden="true" size={15} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              <button
                className="av-button-primary mt-8 w-full"
                onClick={() => addToCart(product, quantity, selectedSize)}
                type="button"
              >
                Add to Cart
              </button>

              <div className="mt-6 space-y-3 border-t border-allavanchy-stone pt-6 text-sm text-allavanchy-graphite">
                <p>Selected size: {selectedSize}</p>
                <p>Quantity: {quantity}</p>
                <p>Complimentary returns within 14 days.</p>
              </div>
            </div>
          </aside>
        </div>

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
            {fallbackRelatedProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={{
                  ...item,
                  price: `$${item.price}`,
                }}
              />
            ))}
          </div>
        </section>
      </div>
    </AnimatedPage>
  );
}

export default ProductDetails;
