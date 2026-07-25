import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext.jsx';

const cartStorageKeyPrefix = 'allavanchy-cart';

export const CartContext = createContext(null);

function getCartStorageKey(userId) {
  return userId ? `${cartStorageKeyPrefix}-${userId}` : null;
}

function getStoredCartItems(storageKey) {
  if (!storageKey) return [];

  try {
    const storedItems = localStorage.getItem(storageKey);
    return storedItems ? JSON.parse(storedItems) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const authContext = useContext(AuthContext);
  const userId = authContext?.user?.id ?? null;
  const [cartItems, setCartItems] = useState([]);

  // Switch to the correct user's cart whenever the logged-in user changes.
  // A user who has never had items saved gets an empty cart here.
  useEffect(() => {
    setCartItems(getStoredCartItems(getCartStorageKey(userId)));
  }, [userId]);

  useEffect(() => {
    const storageKey = getCartStorageKey(userId);
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(cartItems));
  }, [cartItems, userId]);

  const addToCart = useCallback((product, quantity = 1, size = 'One Size') => {
    setCartItems((items) => {
      const cartItemId = `${product.id || product.name}-${size}`;
      const existingItem = items.find((item) => item.cartItemId === cartItemId);

      if (existingItem) {
        return items.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [
        ...items,
        {
          cartItemId,
          id: product.id,
          name: product.name,
          category: product.category,
          image: product.image,
          price: Number(String(product.price).replace('$', '')),
          quantity,
          size,
        },
      ];
    });
  }, []);

  const increaseQuantity = useCallback((cartItemId) => {
    setCartItems((items) =>
      items.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }, []);

  const decreaseQuantity = useCallback((cartItemId) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((cartItemId) => {
    setCartItems((items) => items.filter((item) => item.cartItemId !== cartItemId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems],
  );

  const shipping = subtotal > 0 ? 12 : 0;
  const estimatedTax = subtotal * 0.0825;
  const grandTotal = subtotal + shipping + estimatedTax;

  const value = useMemo(
    () => ({
      addToCart,
      cartItems,
      clearCart,
      decreaseQuantity,
      estimatedTax,
      grandTotal,
      increaseQuantity,
      removeItem,
      shipping,
      subtotal,
    }),
    [
      addToCart,
      cartItems,
      clearCart,
      decreaseQuantity,
      estimatedTax,
      grandTotal,
      increaseQuantity,
      removeItem,
      shipping,
      subtotal,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}