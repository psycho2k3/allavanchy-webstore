import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/mediaService.js';

const defaultHeroImage =
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1900&q=90';

function LuxuryHero({ settings }) {
  const { scrollY } = useScroll();

  const imageY = useTransform(scrollY, [0, 700], [0, 120]);
  const contentY = useTransform(scrollY, [0, 700], [0, -48]);
  const overlayOpacity = useTransform(scrollY, [0, 700], [0.52, 0.76]);

  const heroImage = settings?.hero_image_url || defaultHeroImage;
  const eyebrow = settings?.hero_eyebrow || 'New Season Campaign';
  const heading = settings?.hero_heading || 'Precision in Shadow';
  const subtext =
    settings?.hero_subtext ||
    'Sculptural silhouettes, disciplined tailoring, and after-dark essentials shaped for a modern luxury wardrobe.';
  const buttonLabel = settings?.hero_button_label || 'Shop Collection';

  return (
    <section className="relative -mt-[73px] min-h-[100svh] overflow-hidden bg-allavanchy-black text-allavanchy-ivory md:min-h-screen">
      {/* Hero image */}
      <motion.img
        src={getImageUrl(heroImage)}
        alt="ALLAVANCHY campaign"
        className="absolute inset-0 h-full w-full object-cover object-center md:h-[115%]"
        style={{ y: imageY }}
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />

      {/* Main image overlay */}
      <motion.div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />

      {/* Bottom readability gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />

      {/* Hero content */}
      <div className="relative z-10 flex min-h-[100svh] items-end md:min-h-screen">
        <motion.div
          className="av-container pb-14 pt-32 sm:pb-16 md:pb-24 md:pt-36"
          style={{ y: contentY }}
        >
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
            initial={{ opacity: 0, y: 28 }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Eyebrow */}
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="text-[0.62rem] uppercase tracking-editorial text-allavanchy-stone sm:text-[0.68rem]"
              initial={{ opacity: 0, y: 16 }}
              transition={{
                delay: 0.15,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {eyebrow}
            </motion.p>

            {/* Heading */}
            <motion.h1
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 max-w-5xl font-display text-5xl leading-[0.95] text-allavanchy-ivory sm:text-6xl md:mt-5 md:text-8xl lg:text-9xl"
              initial={{ opacity: 0, y: 28 }}
              transition={{
                delay: 0.28,
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {heading}
            </motion.h1>

            {/* Description */}
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 max-w-xl text-sm leading-6 text-allavanchy-mist sm:mt-6 sm:leading-7 md:text-base"
              initial={{ opacity: 0, y: 18 }}
              transition={{
                delay: 0.42,
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {subtext}
            </motion.p>

            {/* CTA */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mt-7 sm:mt-9"
              initial={{ opacity: 0, y: 16 }}
              transition={{
                delay: 0.56,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                className="av-button border-allavanchy-ivory bg-allavanchy-ivory text-allavanchy-ink hover:bg-transparent hover:text-allavanchy-ivory"
                to="/collections"
              >
                {buttonLabel}
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default LuxuryHero;
