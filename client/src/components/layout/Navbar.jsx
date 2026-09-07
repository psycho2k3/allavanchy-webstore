import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import navigation from '../../data/navigation.js';

const utilityLinks = [
  {
    label: 'Search',
    icon: Search,
    path: '/shop',
  },
  {
    label: 'Wishlist',
    icon: Heart,
    path: '/wishlist',
  },
  {
    label: 'Cart',
    icon: ShoppingBag,
    path: '/cart',
  },
  {
    label: 'Account',
    icon: User,
    path: '/profile',
  },
];

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `relative text-[0.68rem] font-medium uppercase tracking-[0.22em] transition duration-300 ${
      isActive
        ? 'text-allavanchy-ink'
        : 'text-allavanchy-graphite hover:text-allavanchy-ink'
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled || isMenuOpen
          ? 'border-b border-allavanchy-stone/70 bg-allavanchy-ivory/95 text-allavanchy-ink shadow-sm backdrop-blur-md'
          : 'border-b border-transparent bg-allavanchy-ivory/95 text-allavanchy-ink backdrop-blur-sm'
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="relative mx-auto flex min-h-[73px] max-w-7xl items-center px-5 md:px-8"
      >
        {/* ─────────────────────────────────────────
            MOBILE MENU BUTTON
        ───────────────────────────────────────── */}
        <button
          type="button"
          aria-label={
            isMenuOpen
              ? 'Close navigation menu'
              : 'Open navigation menu'
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((current) => !current)}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-allavanchy-ink transition duration-300 hover:bg-allavanchy-mist md:hidden"
        >
          {isMenuOpen ? (
            <X
              aria-hidden="true"
              size={21}
              strokeWidth={1.5}
            />
          ) : (
            <Menu
              aria-hidden="true"
              size={21}
              strokeWidth={1.5}
            />
          )}
        </button>

        {/* ─────────────────────────────────────────
            LOGO
            Mobile: absolutely centered in viewport
            Desktop: normal flex positioning
        ───────────────────────────────────────── */}
        <NavLink
          to="/"
          aria-label="ALLAVANCHY home"
          onClick={closeMenu}
          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[1.25rem] font-medium uppercase tracking-[0.18em] text-allavanchy-ink transition duration-300 hover:opacity-70 sm:text-[1.35rem] md:static md:translate-x-0 md:text-3xl md:tracking-[0.2em]"
        >
          ALLAVANCHY
        </NavLink>

        {/* ─────────────────────────────────────────
            DESKTOP NAVIGATION
        ───────────────────────────────────────── */}
        <div className="ml-auto hidden items-center gap-7 md:flex lg:gap-9">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={navLinkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* ─────────────────────────────────────────
            DESKTOP UTILITIES
        ───────────────────────────────────────── */}
        <div className="ml-8 hidden shrink-0 items-center gap-1 md:flex">
          {utilityLinks.map(
            ({ icon: Icon, label, path }) => (
              <NavLink
                key={label}
                to={path}
                aria-label={label}
                onClick={closeMenu}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-allavanchy-graphite transition duration-300 hover:bg-allavanchy-mist hover:text-allavanchy-ink"
              >
                <Icon
                  aria-hidden="true"
                  size={18}
                  strokeWidth={1.5}
                />
              </NavLink>
            ),
          )}
        </div>

        {/* ─────────────────────────────────────────
            MOBILE SEARCH
            Only Search appears on mobile.
        ───────────────────────────────────────── */}
        <NavLink
          to="/shop"
          aria-label="Search products"
          onClick={closeMenu}
          className="ml-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-allavanchy-ink transition duration-300 hover:bg-allavanchy-mist md:hidden"
        >
          <Search
            aria-hidden="true"
            size={19}
            strokeWidth={1.5}
          />
        </NavLink>
      </nav>

      {/* ─────────────────────────────────────────
          MOBILE NAVIGATION
      ───────────────────────────────────────── */}
      <div
        id="mobile-navigation"
        className={`overflow-hidden border-t border-allavanchy-stone/70 bg-allavanchy-ivory transition-all duration-500 ease-luxury md:hidden ${
          isMenuOpen
            ? 'max-h-[650px] opacity-100'
            : 'max-h-0 opacity-0'
        }`}
      >
        <div className="av-container py-4">
          <div className="grid">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `border-b border-allavanchy-stone/50 py-4 text-sm font-medium uppercase tracking-[0.2em] transition duration-300 ${
                    isActive
                      ? 'text-allavanchy-ink'
                      : 'text-allavanchy-graphite hover:text-allavanchy-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            {/* Mobile utility links */}
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-allavanchy-stone/50 pt-4">
              {utilityLinks
                .filter(
                  ({ label }) => label !== 'Search',
                )
                .map(
                  ({
                    icon: Icon,
                    label,
                    path,
                  }) => (
                    <NavLink
                      key={label}
                      to={path}
                      onClick={closeMenu}
                      className="flex min-h-12 items-center justify-center gap-2 rounded-luxury bg-allavanchy-mist px-3 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-allavanchy-ink transition duration-300 hover:bg-allavanchy-stone"
                    >
                      <Icon
                        aria-hidden="true"
                        size={15}
                        strokeWidth={1.5}
                      />

                      <span>{label}</span>
                    </NavLink>
                  ),
                )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
