import { ShoppingCart } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import navigation from '../../data/navigation.js';

function Header() {
  return (
    <header className="border-b border-allavanchy-stone bg-allavanchy-ivory">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <span className="font-display text-2xl tracking-wide">ALLAVANCHY</span>
        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-xs uppercase tracking-widest text-allavanchy-graphite">
          {navigation.map((item) => (
            <NavLink
              className={({ isActive }) =>
                isActive ? 'text-allavanchy-ink underline underline-offset-4' : 'transition hover:text-allavanchy-ink'
              }
              key={item.path}
              to={item.path}
            >
              {item.label === 'Cart' ? (
                <>
                  <ShoppingCart aria-hidden="true" size={18} strokeWidth={1.5} />
                  <span className="sr-only">Cart</span>
                </>
              ) : (
                item.label
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
