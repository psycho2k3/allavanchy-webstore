import AnimatedPage from '../components/motion/AnimatedPage.jsx';
import Reveal from '../components/motion/Reveal.jsx';
import { getImageUrl } from '../services/mediaService.js';
import aboutPortraitImage from '../assets/images/about-portrait.webp';

function About() {
  return (
    <AnimatedPage className="bg-allavanchy-ivory">
      <section className="border-b border-allavanchy-stone/60">
        <div className="av-container py-12 md:py-16">
          <h1 className="font-sans text-5xl font-light uppercase leading-none tracking-[0.12em] text-allavanchy-ink sm:text-7xl md:text-8xl">
            Allavanchy
          </h1>
        </div>
      </section>

      <section className="av-section">
        <div className="av-container grid gap-12 md:grid-cols-[1fr_1fr] md:gap-16 lg:gap-24">
          <Reveal className="flex flex-col md:min-h-full">
            <p className="text-[0.72rem] uppercase tracking-editorial text-allavanchy-ash">About &mdash; 001</p>

            <p className="mt-12 max-w-xl font-display text-2xl leading-snug text-allavanchy-ink md:mt-auto md:text-[1.9rem]">
              ALLAVANCHY stands as a bold expression of modern luxury, defining an uncompromising aesthetic through
              architectural ready-to-wear garments, sculptural outerwear, and refined leather accessories. The brand
              marries first-principles craftsmanship with uncompromising vision, curating a distinct ecosystem where
              sharp tailoring, rich materials, and commanding silhouettes take center stage.
            </p>

            <span aria-hidden="true" className="mt-12 block h-px w-14 bg-allavanchy-ink md:mt-auto" />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="aspect-[4/5] overflow-hidden bg-allavanchy-mist">
              <img
                alt="ALLAVANCHY model in a black double-breasted tuxedo, bow tie, sunglasses and leather gloves"
                className="h-full w-full object-cover object-[center_15%]"
                src={getImageUrl(aboutPortraitImage)}
              />
            </div>
          </Reveal>
        </div>
      </section>
    </AnimatedPage>
  );
}

export default About;
