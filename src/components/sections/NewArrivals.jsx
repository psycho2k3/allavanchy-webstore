import { Link } from 'react-router-dom';
import ProductCard from '../ui/ProductCard.jsx';
import { newArrivals } from '../../data/homeContent.js';

function NewArrivals() {
  return (
    <section className="av-section bg-allavanchy-pearl">
      <div className="av-container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="av-eyebrow">New Arrivals</p>
            <h2 className="av-heading-xl mt-3">Recently Released</h2>
          </div>
          <Link className="av-button-secondary self-start" to="/shop">
            Shop the Edit
          </Link>
        </div>

        <div className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewArrivals;
