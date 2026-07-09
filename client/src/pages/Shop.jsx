import { useMemo, useState } from 'react';
import AnimatedPage from '../components/motion/AnimatedPage.jsx';
import ProductCard from '../components/ui/ProductCard.jsx';
import products from '../data/products.js';

const productsPerPage = 8;

const sortOptions = {
  featured: 'Featured',
  'price-low-high': 'Price: Low to High',
  'price-high-low': 'Price: High to Low',
  'name-a-z': 'Name: A to Z',
};

function Shop() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(500);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(
    () => ['All', ...new Set(products.map((product) => product.category))],
    [],
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(normalizedSearch) ||
          product.category.toLowerCase().includes(normalizedSearch);
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesPrice = product.price <= maxPrice;

        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low-high') return a.price - b.price;
        if (sortBy === 'price-high-low') return b.price - a.price;
        if (sortBy === 'name-a-z') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [maxPrice, searchTerm, selectedCategory, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );

  const updateSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const updateCategory = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const updateMaxPrice = (event) => {
    setMaxPrice(Number(event.target.value));
    setCurrentPage(1);
  };

  const updateSort = (event) => {
    setSortBy(event.target.value);
    setCurrentPage(1);
  };

  return (
    <AnimatedPage className="bg-allavanchy-ivory pb-20 pt-28">
      <div className="av-container">
        <div className="flex flex-col justify-between gap-6 border-b border-allavanchy-stone pb-8 md:flex-row md:items-end">
          <div>
            <p className="av-eyebrow">Shop</p>
            <h1 className="av-heading-xl mt-3">The ALLAVANCHY Edit</h1>
          </div>
          <p className="av-body max-w-md">
            Explore tailored essentials, polished accessories, and limited pieces selected for a refined wardrobe.
          </p>
        </div>

        <div className="grid gap-8 py-8 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            <div>
              <label className="av-caption" htmlFor="shop-search">
                Search
              </label>
              <input
                className="av-input mt-3 bg-allavanchy-pearl"
                id="shop-search"
                onChange={updateSearch}
                placeholder="Search pieces"
                type="search"
                value={searchTerm}
              />
            </div>

            <div>
              <p className="av-caption">Categories</p>
              <div className="mt-3 flex flex-wrap gap-2 lg:grid">
                {categories.map((category) => (
                  <button
                    className={`rounded-luxury border px-4 py-2 text-left text-xs uppercase tracking-luxury transition duration-300 ease-luxury ${
                      selectedCategory === category
                        ? 'border-allavanchy-ink bg-allavanchy-ink text-allavanchy-ivory'
                        : 'border-allavanchy-stone text-allavanchy-graphite hover:border-allavanchy-ink hover:text-allavanchy-ink'
                    }`}
                    key={category}
                    onClick={() => updateCategory(category)}
                    type="button"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-4">
                <label className="av-caption" htmlFor="price-filter">
                  Price
                </label>
                <span className="text-sm text-allavanchy-graphite">Up to ${maxPrice}</span>
              </div>
              <input
                className="mt-4 w-full accent-allavanchy-ink"
                id="price-filter"
                max="500"
                min="50"
                onChange={updateMaxPrice}
                step="25"
                type="range"
                value={maxPrice}
              />
            </div>
          </aside>

          <div>
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <p className="text-sm text-allavanchy-graphite">
                Showing {paginatedProducts.length} of {filteredProducts.length} products
              </p>
              <label className="flex items-center gap-3 text-xs uppercase tracking-luxury text-allavanchy-ash">
                Sort
                <select className="av-input min-w-48 bg-allavanchy-pearl" onChange={updateSort} value={sortBy}>
                  {Object.entries(sortOptions).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {paginatedProducts.length > 0 ? (
              <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,
                      price: `$${product.price}`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="border border-allavanchy-stone bg-allavanchy-pearl px-6 py-16 text-center">
                <h2 className="av-heading-md">No pieces found</h2>
                <p className="av-body mx-auto mt-3 max-w-md">
                  Adjust your search, category, or price filter to view more from the collection.
                </p>
              </div>
            )}

            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                className="av-button-secondary disabled:cursor-not-allowed disabled:opacity-40"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                type="button"
              >
                Previous
              </button>
              <span className="px-4 text-sm text-allavanchy-graphite">
                {currentPage} / {totalPages}
              </span>
              <button
                className="av-button-secondary disabled:cursor-not-allowed disabled:opacity-40"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                type="button"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default Shop;
