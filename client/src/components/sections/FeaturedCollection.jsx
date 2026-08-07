import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCollections } from '../../services/collectionApi.js';
import { getImageUrl } from '../../services/mediaService.js';

function FeaturedCollection() {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await getAllCollections();
        setCollections(data);
      } catch {
        setCollections([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCollections();
  }, []);

  const featured = useMemo(() => {
    if (collections.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * collections.length);
    return collections[randomIndex];
  }, [collections]);

  if (isLoading || !featured) return null;

  return (
    <section className="av-section bg-allavanchy-ivory">
      <div className="av-container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="av-eyebrow">Featured Collection</p>
            <h2 className="av-heading-xl mt-3">{featured.name}</h2>
          </div>
          <Link className="av-link text-sm uppercase tracking-luxury" to="/collections">
            Explore all collections
          </Link>
        </div>

        <article className="group mt-10">
          <div className="av-hover-image aspect-[16/9] bg-allavanchy-mist">
            {featured.image_url && (
              <img
                alt={featured.name}
                className="h-full w-full object-cover"
                src={getImageUrl(featured.image_url)}
              />
            )}
          </div>
          <div className="mt-5 flex flex-col justify-between gap-3 md:flex-row">
            <div>
              <h3 className="av-heading-md">{featured.name}</h3>
              <p className="av-body mt-2 max-w-lg">{featured.subtitle}</p>
            </div>
            <Link className="av-button-ghost self-start" to="/shop">
              Shop
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}

export default FeaturedCollection;