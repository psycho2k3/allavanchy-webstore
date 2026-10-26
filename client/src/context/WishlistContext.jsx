import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext.jsx';
import { toPriceNumber } from '../utils/money.js';

const wishlistStorageKeyPrefix = 'allavanchy-wishlist';

export const WishlistContext = createContext(null);

function getWishlistStorageKey(userId) {
  return userId ? `${wishlistStorageKeyPrefix}-${userId}` : null;
}

function toStock(value) {
  const stock = Number(value);
  return Number.isFinite(stock) ? stock : undefined;
}

function getStoredWishlistItems(storageKey) {
  if (!storageKey) return [];

  try {
    const storedItems = JSON.parse(localStorage.getItem(storageKey) || '[]');

    // Older wishlists stored prices as display strings ("$49.50"); normalise on load.
    return Array.isArray(storedItems)
      ? storedItems
          .filter((item) => item && typeof item === 'object' && item.id != null)
          .map((item) => ({ ...item, price: toPriceNumber(item.price) }))
      : [];
  } catch {
    return [];
  }
}

function loadWishlist(storageKey) {
  return { storageKey, items: getStoredWishlistItems(storageKey) };
}

export function WishlistProvider({ children }) {
  const authContext = useContext(AuthContext);
  const userId = authContext?.user?.id ?? null;
  const storageKey = getWishlistStorageKey(userId);

  // Read from storage during the first render and remember the source key, so the
  // persist effect only ever writes a user's own items back under their key.
  const [wishlist, setWishlist] = useState(() => loadWishlist(storageKey));

  // Switch to the correct user's wishlist whenever the logged-in user changes.
  // A user who has never had items saved gets an empty wishlist here.
  if (wishlist.storageKey !== storageKey) {
    setWishlist(loadWishlist(storageKey));
  }

  const wishlistItems = useMemo(
    () => (wishlist.storageKey === storageKey ? wishlist.items : []),
    [wishlist, storageKey],
  );

  useEffect(() => {
    if (!wishlist.storageKey) return;
    localStorage.setItem(wishlist.storageKey, JSON.stringify(wishlist.items));
  }, [wishlist]);

  const setWishlistItems = useCallback((updater) => {
    setWishlist((current) => ({ ...current, items: updater(current.items) }));
  }, []);

  const isInWishlist = useCallback(
    (productId) => wishlistItems.some((item) => item.id === productId),
    [wishlistItems],
  );

  const addToWishlist = useCallback((product) => {
    setWishlistItems((items) => {
      if (items.some((item) => item.id === product.id)) {
        return items;
      }

      return [
        ...items,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          image: product.image,
          price: toPriceNumber(product.price),
          sizes: Array.isArray(product.sizes) ? product.sizes : [],
          stock: toStock(product.stock),
        },
      ];
    });
  }, [setWishlistItems]);

  const removeFromWishlist = useCallback((productId) => {
    setWishlistItems((items) => items.filter((item) => item.id !== productId));
  }, [setWishlistItems]);

  const toggleWishlist = useCallback(
    (product) => {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    },
    [isInWishlist, addToWishlist, removeFromWishlist],
  );

  const clearWishlist = useCallback(() => {
    setWishlistItems(() => []);
  }, [setWishlistItems]);

  const value = useMemo(
    () => ({
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
    }),
    [wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, clearWishlist],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
