import { Link } from 'react-router-dom';

function HomeHero() {
  return (
    <section className="relative -mt-[73px] min-h-screen overflow-hidden bg-allavanchy-black text-allavanchy-ivory">
      <img
        alt="ALLAVANCHY editorial model wearing a sculptural black look"
        className="absolute inset-0 h-full w-full object-cover opacity-80"
        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=90"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/65" />
      <div className="relative z-10 flex min-h-screen items-end">
        <div className="av-container pb-14 pt-32 md:pb-20">
          <div className="max-w-3xl av-fade-up">
            <p className="text-[0.68rem] uppercase tracking-editorial text-allavanchy-stone">
              Autumn Editorial
            </p>
            <h1 className="mt-5 font-display text-6xl leading-none text-allavanchy-ivory md:text-8xl lg:text-9xl">
              ALLAVANCHY
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-allavanchy-mist md:text-base">
              Modern tailoring, sculptural eveningwear, and polished essentials shaped for a refined wardrobe.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className="av-button bg-allavanchy-ivory text-allavanchy-ink hover:bg-allavanchy-stone" to="/shop">
                Shop New Arrivals
              </Link>
              <Link className="av-button border-allavanchy-ivory text-allavanchy-ivory hover:bg-allavanchy-ivory hover:text-allavanchy-ink" to="/collections">
                View Collections
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeHero;
