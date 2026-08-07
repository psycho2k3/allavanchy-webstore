import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/mediaService.js';

function LandingPage({ settings }) {
  const buttonLabel = settings?.landing_button_label || 'Discover Winter 27';

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-between overflow-hidden bg-allavanchy-ink px-5 py-10 text-center text-allavanchy-ivory">
      {settings?.landing_image_url ? (
        <img
          alt="ALLAVANCHY"
          className="absolute inset-0 h-full w-full object-cover"
          src={getImageUrl(settings.landing_image_url)}
        />
      ) : null}
      <div className="absolute inset-0 bg-black/40" />

      <p className="relative z-10 font-display text-2xl uppercase tracking-[0.18em] md:text-3xl">
        ALLAVANCHY
      </p>

      <Link
        className="av-button relative z-10 border-allavanchy-ivory bg-allavanchy-ivory text-allavanchy-ink hover:bg-transparent hover:text-allavanchy-ivory"
        to="/collections"
      >
        {buttonLabel}
      </Link>
    </div>
  );
}

export default LandingPage;