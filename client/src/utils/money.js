const formatterCache = new Map();

function getFormatter(currency) {
  if (!formatterCache.has(currency)) {
    let formatter;

    try {
      formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency });
    } catch {
      // Unknown currency codes throw; fall back to USD rather than breaking the page.
      formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    }

    formatterCache.set(currency, formatter);
  }

  return formatterCache.get(currency);
}

// Converts stored prices to numbers. Older cart/wishlist entries saved prices
// as display strings such as "$49.50", so strip everything except digits and dots.
export function toPriceNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;

  const parsed = Number(String(value ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatMoney(value, currency = 'USD') {
  return getFormatter(currency || 'USD').format(toPriceNumber(value));
}
