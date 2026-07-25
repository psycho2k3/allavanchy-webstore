import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext.jsx';

const wishlistStorageKeyPrefix = 'allavanchy-wishlist';

export const WishlistContext = createContext(null);

function getWishlistStorageKey(userId) {
  return userId ? `${wishlistStorageKeyPrefix}-${userId}` : null;
}

function getStoredWishlistItems(storageKey) {
  if (!storageKey) return [];

  try {
    const storedItems = localStorage.getItem(storageKey);
    return storedItems ? JSON.parse(storedItems) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const authContext = useContext(AuthContext);
  const userId = authContext?.user?.id ?? null;
  const [wishlistItems, setWishlistItems] = useState([]);

  // Switch to the correct user's wishlist whenever the logged-in user changes.
  // A user who has never had items saved gets an empty wishlist here.
  useEffect(() => {
    setWishlistItems(getStoredWishlistItems(getWishlistStorageKey(userId)));
  }, [userId]);

  useEffect(() => {
    const storageKey = getWishlistStorageKey(userId);
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(wishlistItems));
  }, [wishlistItems, userId]);

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
          price: product.price,
        },
      ];
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlistItems((items) => items.filter((item) => item.id !== productId));
  }, []);

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
    setWishlistItems([]);
  }, []);

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