import { useEffect, useState } from 'react';
import AnimatedPage from '../components/motion/AnimatedPage.jsx';
import { Link } from 'react-router-dom';
import { getAllCollections } from '../services/collectionApi.js';
import { getImageUrl } from '../services/mediaService.js';
import collectionsHeroImage from '../assets/images/collections-hero.jpg';

function Collections() {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const loadCollections = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const data = await getAllCollections();
        setCollections(data);
      } catch (error) {
        setLoadError(error.response?.data?.message || 'Unable to load collections');
      } finally {
        setIsLoading(false);
      }
    };

    loadCollections();
  }, []);

  return (
    <AnimatedPage className="bg-allavanchy-ivory">
      <div className="relative -mt-[73px] min-h-[78vh] overflow-hidden bg-allavanchy-ink text-allavanchy-ivory">
        <img
          alt="ALLAVANCHY collections"
          className="absolute inset-0 h-full w-full object-cover opacity-75"
          src={getImageUrl(collectionsHeroImage)}
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 flex min-h-[78vh] items-end">
          <div className="av-container pb-16 pt-32">
            <p className="text-[0.68rem] uppercase tracking-editorial text-allavanchy-stone">
              Collections
            </p>
            <h1 className="mt-5 max-w-4xl font-display text-6xl leading-none text-allavanchy-ivory md:text-8xl">
              Editorial Wardrobes for the Season
            </h1>
          </div>
        </div>
      </div>

      <div className="av-section av-container">
        {isLoading ? (
          <p className="av-body text-center">Loading collections...</p>
        ) : loadError ? (
          <div className="border border-allavanchy-stone bg-allavanchy-pearl px-6 py-16 text-center">
            <h2 className="av-heading-md">Unable to load collections</h2>
            <p className="av-body mx-auto mt-3 max-w-md">{loadError}</p>
          </div>
        ) : collections.length === 0 ? (
          <div className="border border-allavanchy-stone bg-allavanchy-pearl px-6 py-16 text-center">
            <h2 className="av-heading-md">No collections yet</h2>
            <p className="av-body mx-auto mt-3 max-w-md">Check back soon for curated edits.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {collections.map((collection, index) => (
              <article
                className={`grid overflow-hidden bg-allavanchy-pearl shadow-luxury-soft md:grid-cols-2 ${
                  index % 2 === 1 ? 'md:[&>div:first-child]:order-2' : ''
                }`}
                key={collection.id}
              >
                <div className="av-hover-image min-h-[420px]">
                  {collection.image_url && (
                    <img
                      alt={collection.name}
                      className="h-full w-full object-cover"
                      src={getImageUrl(collection.image_url)}
                    />
                  )}
                </div>
                <div className="flex items-center p-8 md:p-12 lg:p-16">
                  <div>
                    <p className="av-eyebrow">{collection.products?.length || 0} pieces</p>
                    <h2 className="av-heading-xl mt-3">{collection.name}</h2>
                    <p className="av-body mt-5 max-w-lg">{collection.subtitle}</p>
                    <Link className="av-button-secondary mt-8" to="/shop">
                      Shop Collection
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}

export default Collections;