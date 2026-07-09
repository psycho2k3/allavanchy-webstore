import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

const cartStorageKey = 'allavanchy-cart';

export const CartContext = createContext(null);

function getStoredCartItems() {
  try {
    const storedItems = localStorage.getItem(cartStorageKey);
    return storedItems ? JSON.parse(storedItems) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getStoredCartItems);

  useEffect(() => {
    localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
  }, [cartItems]);

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
