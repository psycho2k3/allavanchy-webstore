import { Minus, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/mediaService.js';

function CartItem({ item, onDecrease, onIncrease, onRemove }) {
  return (
    <article className="grid gap-4 border-b border-allavanchy-stone py-6 sm:grid-cols-[120px_1fr]">
      <Link className="block overflow-hidden bg-allavanchy-mist" to={`/products/${item.id}`}>
        <img alt={item.name} className="aspect-[3/4] h-full w-full object-cover" src={getImageUrl(item.image)} />
      </Link>

      <div className="flex flex-col gap-5 sm:flex-row sm:justify-between">
        <div>
          <p className="av-caption">{item.category}</p>
          <Link className="mt-2 block text-sm font-medium uppercase tracking-luxury text-allavanchy-ink" to={`/products/${item.id}`}>
            {item.name}
          </Link>
          <p className="mt-2 text-sm text-allavanchy-graphite">Size: {item.size}</p>
          <p className="mt-1 text-sm text-allavanchy-graphite">${item.price}</p>
        </div>

        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
          <button
            aria-label={`Remove ${item.name}`}
            className="inline-flex h-9 w-9 items-center justify-center text-allavanchy-ash transition hover:text-allavanchy-ink"
            onClick={onRemove}
            type="button"
          >
            <X aria-hidden="true" size={17} strokeWidth={1.5} />
          </button>

          <div className="inline-flex min-h-10 items-center border border-allavanchy-stone">
            <button
              aria-label={`Decrease ${item.name} quantity`}
              className="inline-flex h-10 w-10 items-center justify-center transition hover:bg-allavanchy-mist"
              onClick={onDecrease}
              type="button"
            >
              <Minus aria-hidden="true" size={14} strokeWidth={1.5} />
            </button>
            <span className="min-w-10 text-center text-sm">{item.quantity}</span>
            <button
              aria-label={`Increase ${item.name} quantity`}
              className="inline-flex h-10 w-10 items-center justify-center transition hover:bg-allavanchy-mist"
              onClick={onIncrease}
              type="button"
            >
              <Plus aria-hidden="true" size={14} strokeWidth={1.5} />
            </button>
          </div>

          <p className="text-sm font-medium text-allavanchy-ink">${item.price * item.quantity}</p>
        </div>
      </div>
    </article>
  );
}

export default CartItem;
