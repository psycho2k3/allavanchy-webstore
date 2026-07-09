import AnimatedPage from '../components/motion/AnimatedPage.jsx';
import Reveal from '../components/motion/Reveal.jsx';
import { getImageUrl } from '../services/mediaService.js';

function About() {
  return (
    <AnimatedPage className="bg-allavanchy-ivory">
      <section className="relative -mt-[73px] min-h-[78vh] overflow-hidden bg-allavanchy-ink text-allavanchy-ivory">
        <img
          alt="ALLAVANCHY editorial atelier"
          className="absolute inset-0 h-full w-full object-cover opacity-75"
          src={getImageUrl('https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1800&q=90')}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex min-h-[78vh] items-end">
          <div className="av-container pb-16 pt-32">
            <p className="text-[0.68rem] uppercase tracking-editorial text-allavanchy-stone">About the House</p>
            <h1 className="mt-5 max-w-4xl font-display text-6xl leading-none text-allavanchy-ivory md:text-8xl">
              Quiet Luxury, Cut With Precision
            </h1>
          </div>
        </div>
      </section>

      <section className="av-section">
        <div className="av-container grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <Reveal>
            <div className="av-hover-image aspect-[4/5] bg-allavanchy-mist">
              <img
                alt="ALLAVANCHY sculptural fashion silhouette"
                className="h-full w-full object-cover"
                src={getImageUrl('https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=90')}
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="av-eyebrow">Brand Story</p>
            <h2 className="av-heading-xl mt-3">A Wardrobe Built on Discipline</h2>
            <p className="av-body mt-6">
              ALLAVANCHY was created for women who prefer presence over excess. The brand studies proportion, fabric, and finish to create pieces that feel deliberate from every angle.
            </p>
            <p className="av-body mt-4">
              Our collections move between sculptural tailoring, fluid eveningwear, and essential layers, always grounded in a restrained palette and a sharp editorial point of view.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="av-section bg-allavanchy-pearl">
        <div className="av-container grid gap-6 md:grid-cols-2">
          <Reveal className="border border-allavanchy-stone bg-allavanchy-ivory p-8 md:p-10">
            <p className="av-eyebrow">Mission</p>
            <h2 className="av-heading-lg mt-3">To Refine the Everyday Wardrobe</h2>
            <p className="av-body mt-5">
              We design pieces that sharpen daily dressing through clean construction, tactile materials, and silhouettes that remain relevant beyond a single season.
            </p>
          </Reveal>
          <Reveal className="border border-allavanchy-stone bg-allavanchy-ivory p-8 md:p-10" delay={0.1}>
            <p className="av-eyebrow">Vision</p>
            <h2 className="av-heading-lg mt-3">To Build a Modern Luxury House</h2>
            <p className="av-body mt-5">
              ALLAVANCHY aims to become a destination for thoughtful fashion: precise, minimal, emotionally strong, and unmistakably polished.
            </p>
          </Reveal>
        </div>
      </section>
    </AnimatedPage>
  );
}

export default About;
