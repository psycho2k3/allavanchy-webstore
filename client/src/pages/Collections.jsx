import AnimatedPage from '../components/motion/AnimatedPage.jsx';
import { Link } from 'react-router-dom';
import collections, { collectionCategories } from '../data/collections.js';
import { getImageUrl } from '../services/mediaService.js';

function Collections() {
  return (
    <AnimatedPage className="bg-allavanchy-ivory">
      <div className="relative -mt-[73px] min-h-[78vh] overflow-hidden bg-allavanchy-ink text-allavanchy-ivory">
        <img
          alt="ALLAVANCHY collections editorial campaign"
          className="absolute inset-0 h-full w-full object-cover opacity-75"
          src={getImageUrl('https://images.unsplash.com/photo-1513379733131-47fc74b45fc7?auto=format&fit=crop&w=1800&q=90')}
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
        <div className="grid gap-8">
          {collections.map((collection, index) => (
            <article
              className={`grid overflow-hidden bg-allavanchy-pearl shadow-luxury-soft md:grid-cols-2 ${
                index % 2 === 1 ? 'md:[&>div:first-child]:order-2' : ''
              }`}
              key={collection.id}
            >
              <div className="av-hover-image min-h-[420px]">
                <img
                  alt={collection.title}
                  className="h-full w-full object-cover"
                  src={getImageUrl(collection.image)}
                />
              </div>
              <div className="flex items-center p-8 md:p-12 lg:p-16">
                <div>
                  <p className="av-eyebrow">{collection.category}</p>
                  <h2 className="av-heading-xl mt-3">{collection.title}</h2>
                  <p className="av-body mt-5 max-w-lg">{collection.subtitle}</p>
                  <Link className="av-button-secondary mt-8" to="/shop">
                    Shop Collection
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="av-section bg-allavanchy-pearl">
        <div className="av-container">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="av-eyebrow">Categories</p>
              <h2 className="av-heading-xl mt-3">Shop by Mood</h2>
            </div>
            <p className="av-body max-w-md">
              Move through the collection by silhouette, occasion, and the pieces that define your wardrobe.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {collectionCategories.map((category) => (
              <Link className="group" key={category.title} to="/shop">
                <div className="av-hover-image aspect-[4/5] bg-allavanchy-mist">
                  <img
                    alt={category.title}
                    className="h-full w-full object-cover"
                    src={getImageUrl(category.image)}
                  />
                </div>
                <div className="mt-4">
                  <h3 className="av-heading-md">{category.title}</h3>
                  <p className="av-body mt-2">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default Collections;
