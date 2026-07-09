import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-allavanchy-ink text-allavanchy-ivory">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] md:px-8">
        <div>
          <h2 className="font-display text-3xl uppercase tracking-[0.18em]">ALLAVANCHY</h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-allavanchy-stone">
            Sculptural essentials, precise tailoring, and modern evening pieces designed for a quieter kind of luxury.
          </p>
          <form className="mt-8 flex max-w-md border-b border-allavanchy-stone">
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              className="min-w-0 flex-1 bg-transparent py-3 text-sm text-allavanchy-ivory placeholder:text-allavanchy-stone focus:outline-none"
              id="newsletter-email"
              placeholder="Email address"
              type="email"
            />
            <button className="py-3 text-xs uppercase tracking-[0.22em]" type="submit">
              Join
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.24em] text-allavanchy-stone">Quick Links</h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link className="transition hover:text-allavanchy-stone" to="/shop">Shop</Link>
            </li>
            <li>
              <Link className="transition hover:text-allavanchy-stone" to="/about">About</Link>
            </li>
            <li>
              <Link className="transition hover:text-allavanchy-stone" to="/contact">Contact</Link>
            </li>
            <li>
              <Link className="transition hover:text-allavanchy-stone" to="/faq">FAQ</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.24em] text-allavanchy-stone">Collections</h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link className="transition hover:text-allavanchy-stone" to="/collections">New Season</Link>
            </li>
            <li>
              <Link className="transition hover:text-allavanchy-stone" to="/collections">Tailoring</Link>
            </li>
            <li>
              <Link className="transition hover:text-allavanchy-stone" to="/collections">Eveningwear</Link>
            </li>
            <li>
              <Link className="transition hover:text-allavanchy-stone" to="/collections">Accessories</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.24em] text-allavanchy-stone">Social Links</h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a className="transition hover:text-allavanchy-stone" href="https://instagram.com">Instagram</a>
            </li>
            <li>
              <a className="transition hover:text-allavanchy-stone" href="https://tiktok.com">TikTok</a>
            </li>
            <li>
              <a className="transition hover:text-allavanchy-stone" href="https://pinterest.com">Pinterest</a>
            </li>
            <li>
              <a className="transition hover:text-allavanchy-stone" href="https://x.com">X</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-[0.68rem] uppercase tracking-[0.22em] text-allavanchy-stone md:flex-row md:items-center md:justify-between">
          <p>Copyright 2026 ALLAVANCHY. All rights reserved.</p>
          <div className="flex gap-5">
            <Link className="transition hover:text-allavanchy-ivory" to="/contact">Client Services</Link>
            <Link className="transition hover:text-allavanchy-ivory" to="/faq">Shipping & Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
