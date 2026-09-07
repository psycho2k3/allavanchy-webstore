import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Container from '../ui/Container.jsx';
import ProductCard from '../ui/ProductCard.jsx';
import { getAllProducts, normalizeProduct } from '../../services/productApi.js';

function shuffleProducts(products) {
  return [...products].sort(() => Math.random() - 0.5);
}

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const data = await getAllProducts();

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

        const normalized = list.map(normalizeProduct);
        const randomized = shuffleProducts(normalized);

        if (isMounted) {
          setProducts(randomized.slice(0, 4));
        }
      } catch {
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading || products.length === 0) {
    return null;
  }

  return (
    <section className="bg-allavanchy-ivory py-16 md:py-24">
      <Container>
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="av-eyebrow">The Edit</p>

            <h2 className="av-heading-xl mt-3">
              Featured Pieces
            </h2>
          </div>

          <p className="av-body max-w-md md:text-right">
            A considered selection of pieces from the ALLAVANCHY collection.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-6">
          {products.map((product, index) => (
            <div
              className={`
                ${index === 1 ? 'translate-y-5' : ''}
                ${index === 2 ? '-translate-y-3' : ''}
                ${index === 3 ? 'translate-y-2 md:hidden' : ''}
                md:translate-y-0
              `}
              key={product.id}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            className="av-button-primary"
            to="/shop"
          >
            Shop All Pieces
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default FeaturedProducts;