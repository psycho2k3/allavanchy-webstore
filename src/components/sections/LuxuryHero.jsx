import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/mediaService.js';

const heroImage = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1900&q=90';

function LuxuryHero() {
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 700], [0, 120]);
  const contentY = useTransform(scrollY, [0, 700], [0, -48]);
  const overlayOpacity = useTransform(scrollY, [0, 700], [0.52, 0.76]);

  return (
    <section className="relative -mt-[73px] min-h-screen overflow-hidden bg-allavanchy-black text-allavanchy-ivory">
      <motion.img
        alt="ALLAVANCHY premium fashion campaign in sculptural black tailoring"
        className="absolute inset-0 h-[115%] w-full object-cover"
        src={getImageUrl(heroImage)}
        style={{ y: imageY }}
      />

      <motion.div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />

      <div className="relative z-10 flex min-h-screen items-end">
        <motion.div
          className="av-container pb-16 pt-36 md:pb-24"
          style={{ y: contentY }}
        >
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
            initial={{ opacity: 0, y: 28 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="text-[0.68rem] uppercase tracking-editorial text-allavanchy-stone"
              initial={{ opacity: 0, y: 16 }}
              transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              New Season Campaign
            </motion.p>

            <motion.h1
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 max-w-5xl font-display text-6xl leading-none text-allavanchy-ivory md:text-8xl lg:text-9xl"
              initial={{ opacity: 0, y: 28 }}
              transition={{ delay: 0.28, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              Precision in Shadow
            </motion.h1>

            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 max-w-xl text-sm leading-7 text-allavanchy-mist md:text-base"
              initial={{ opacity: 0, y: 18 }}
              transition={{ delay: 0.42, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              Sculptural silhouettes, disciplined tailoring, and after-dark essentials shaped for a modern luxury wardrobe.
            </motion.p>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mt-9"
              initial={{ opacity: 0, y: 16 }}
              transition={{ delay: 0.56, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                className="av-button border-allavanchy-ivory bg-allavanchy-ivory text-allavanchy-ink hover:bg-transparent hover:text-allavanchy-ivory"
                to="/collections"
              >
                Shop Collection
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default LuxuryHero;
