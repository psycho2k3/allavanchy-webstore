import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import navigation from '../../data/navigation.js';

const utilityLinks = [
  { label: 'Search', icon: Search, path: '/shop' },
  { label: 'Cart', icon: ShoppingBag, path: '/cart' },
];

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  const navClassName = ({ isActive }) =>
    `text-[0.68rem] uppercase tracking-[0.24em] transition ${
      isActive ? 'text-allavanchy-ink' : 'text-allavanchy-graphite hover:text-allavanchy-ink'
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition duration-300 ${
        isScrolled || isMenuOpen
          ? 'border-b border-allavanchy-stone bg-allavanchy-ivory/95 shadow-sm backdrop-blur'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <button
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="inline-flex h-10 w-10 items-center justify-center md:hidden"
          onClick={() => setIsMenuOpen((current) => !current)}
          type="button"
        >
          {isMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>

        <NavLink
          aria-label="ALLAVANCHY home"
          className="font-display text-2xl uppercase tracking-[0.18em] md:text-3xl"
          onClick={closeMenu}
          to="/"
        >
          ALLAVANCHY
        </NavLink>

        <div className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <NavLink className={navClassName} key={item.path} to={item.path}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-1 md:gap-3">
          {utilityLinks.map(({ icon: Icon, label, path }) => (
            <NavLink
              aria-label={label}
              className="inline-flex h-10 w-10 items-center justify-center text-allavanchy-graphite transition hover:text-allavanchy-ink"
              key={label}
              to={path}
            >
              <Icon aria-hidden="true" size={19} strokeWidth={1.5} />
            </NavLink>
          ))}
        </div>
      </nav>

      <div
        className={`overflow-hidden border-t border-allavanchy-stone bg-allavanchy-ivory transition-all duration-300 md:hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="grid gap-1 px-5 py-5">
          {navigation.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `py-3 text-sm uppercase tracking-[0.22em] ${
                  isActive ? 'text-allavanchy-ink' : 'text-allavanchy-graphite'
                }`
              }
              key={item.path}
              onClick={closeMenu}
              to={item.path}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
