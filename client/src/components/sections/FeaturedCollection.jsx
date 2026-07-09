import { Link } from 'react-router-dom';
import { featuredCollections } from '../../data/homeContent.js';
import { getImageUrl } from '../../services/mediaService.js';

function FeaturedCollection() {
  return (
    <section className="av-section bg-allavanchy-ivory">
      <div className="av-container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="av-eyebrow">Featured Collection</p>
            <h2 className="av-heading-xl mt-3">A Study in Line and Shadow</h2>
          </div>
          <Link className="av-link text-sm uppercase tracking-luxury" to="/collections">
            Explore all collections
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {featuredCollections.map((collection) => (
            <article className="group" key={collection.title}>
              <div className="av-hover-image aspect-[4/5] bg-allavanchy-mist">
                <img
                  alt={collection.title}
                  className="h-full w-full object-cover"
                  src={getImageUrl(collection.image)}
                />
              </div>
              <div className="mt-5 flex flex-col justify-between gap-3 md:flex-row">
                <div>
                  <h3 className="av-heading-md">{collection.title}</h3>
                  <p className="av-body mt-2 max-w-lg">{collection.description}</p>
                </div>
                <Link className="av-button-ghost self-start" to="/shop">
                  Shop
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedCollection;
