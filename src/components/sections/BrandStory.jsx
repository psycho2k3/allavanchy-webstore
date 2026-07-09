import { getImageUrl } from '../../services/mediaService.js';

const brandStoryImage = 'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1100&q=85';

function BrandStory() {
  return (
    <section className="av-section bg-allavanchy-ivory">
      <div className="av-container grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div className="av-hover-image aspect-[4/5] bg-allavanchy-mist">
          <img
            alt="ALLAVANCHY studio tailoring detail"
            className="h-full w-full object-cover"
            src={getImageUrl(brandStoryImage)}
          />
        </div>
        <div className="md:pl-10">
          <p className="av-eyebrow">Brand Story</p>
          <h2 className="av-heading-xl mt-3">Designed With Restraint. Finished With Intention.</h2>
          <p className="av-body mt-6">
            ALLAVANCHY is built around wardrobe pieces that hold their shape, sharpen the silhouette, and move easily between day and evening.
          </p>
          <p className="av-body mt-4">
            The house language is minimal, precise, and quietly dramatic: clean lines, tactile fabrics, and a palette that lets proportion speak first.
          </p>
        </div>
      </div>
    </section>
  );
}

export default BrandStory;
