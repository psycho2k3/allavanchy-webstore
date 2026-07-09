import { instagramGallery } from '../../data/homeContent.js';
import { getImageUrl } from '../../services/mediaService.js';

function InstagramGallery() {
  return (
    <section className="av-section bg-allavanchy-pearl">
      <div className="av-container">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="av-eyebrow">Instagram</p>
            <h2 className="av-heading-lg mt-3">@allavanchy</h2>
          </div>
          <a className="av-link text-sm uppercase tracking-luxury" href="https://instagram.com">
            Follow the house
          </a>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {instagramGallery.map((image, index) => (
            <a
              className="av-hover-image aspect-square bg-allavanchy-mist"
              href="https://instagram.com"
              key={image}
            >
              <img
                alt={`ALLAVANCHY Instagram editorial ${index + 1}`}
                className="h-full w-full object-cover"
                src={getImageUrl(image)}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default InstagramGallery;
