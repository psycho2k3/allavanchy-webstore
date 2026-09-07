import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCollections } from '../../services/collectionApi.js';
import { getImageUrl } from '../../services/mediaService.js';

function FeaturedCollection() {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCollections = async () => {
      try {
        const data = await getAllCollections();

        if (isMounted) {
          setCollections(Array.isArray(data) ? data : []);
        }
      } catch {
        if (isMounted) {
          setCollections([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCollections();

    return () => {
      isMounted = false;
    };
  }, []);

  // Collections arrive newest-first, so the newest collection
  // is consistently featured.
  const featured = collections[0] || null;

  if (isLoading || !featured) {
    return null;
  }

  return (
    <section className="av-section bg-allavanchy-ivory">
      <div className="av-container">
        {/* Section heading */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="av-eyebrow">
              Featured Collection
            </p>

            <h2 className="av-heading-xl mt-3">
              {featured.name}
            </h2>
          </div>

          <Link
            className="av-link text-sm uppercase tracking-luxury"
            to="/collections"
          >
            Explore all collections
          </Link>
        </div>

        {/* Collection feature */}
        <article className="group mt-8 sm:mt-10">
          <div className="av-hover-image aspect-[4/3] overflow-hidden bg-allavanchy-mist md:aspect-[16/9]">
            {featured.image_url ? (
              <img
                src={getImageUrl(featured.image_url, {
                  width: 1200,
                })}
                alt={featured.name}
                className="h-full w-full object-cover object-center transition duration-700 ease-luxury group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            ) : null}
          </div>

          {/* Collection information */}
          <div className="mt-5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <h3 className="av-heading-md">
                {featured.name}
              </h3>

              {featured.subtitle ? (
                <p className="av-body mt-2 max-w-lg">
                  {featured.subtitle}
                </p>
              ) : null}
            </div>

            <Link
              className="av-button-ghost self-start"
              to="/shop"
            >
              Shop
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}

export default FeaturedCollection;