import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/mediaService.js';

const limitedDropImage = 'https://images.unsplash.com/photo-1506629905607-d405b7a30db9?auto=format&fit=crop&w=1300&q=90';

function LimitedDrop() {
  return (
    <section className="bg-allavanchy-ink text-allavanchy-ivory">
      <div className="grid min-h-[680px] md:grid-cols-2">
        <div className="order-2 flex items-center px-5 py-16 md:order-1 md:px-12 lg:px-20">
          <div className="max-w-xl">
            <p className="text-[0.68rem] uppercase tracking-editorial text-allavanchy-stone">Limited Drop</p>
            <h2 className="mt-4 font-display text-5xl leading-none text-allavanchy-ivory md:text-7xl">
              The Midnight Capsule
            </h2>
            <p className="mt-6 text-sm leading-7 text-allavanchy-stone md:text-base">
              A tightly edited release of black tailoring, satin surfaces, and after-dark accessories available for a short run.
            </p>
            <Link className="av-button mt-9 border-allavanchy-ivory text-allavanchy-ivory hover:bg-allavanchy-ivory hover:text-allavanchy-ink" to="/collections">
              Discover the Drop
            </Link>
          </div>
        </div>
        <div className="order-1 min-h-[420px] md:order-2 md:min-h-full">
          <img
            alt="Limited drop black evening look"
            className="h-full w-full object-cover"
            src={getImageUrl(limitedDropImage)}
          />
        </div>
      </div>
    </section>
  );
}

export default LimitedDrop;
