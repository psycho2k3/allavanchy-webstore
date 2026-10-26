import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext.jsx';
import { getPublicSettings } from '../services/settingsApi.js';
import { getAllProducts, normalizeProduct } from '../services/productApi.js';
import { toPriceNumber } from '../utils/money.js';

const cartStorageKeyPrefix = 'allavanchy-cart';

export const DEFAULT_CART_SIZE = 'One Size';

export const CartContext = createContext(null);

function getCartStorageKey(userId) {
  return userId ? `${cartStorageKeyPrefix}-${userId}` : null;
}

// Lines without a known stock level are treated as unlimited; the API still
// rejects orders that exceed real stock.
export function getMaxQuantity(stock) {
  return Number.isFinite(stock) && stock >= 0 ? stock : Infinity;
}

function toStock(value) {
  const stock = Number(value);
  return Number.isFinite(stock) ? stock : undefined;
}

// Older carts stored prices as display strings ("$49.50"); normalise on load.
function normalizeStoredCartItem(item) {
  return {
    ...item,
    price: toPriceNumber(item.price),
    quantity: Math.max(1, Number(item.quantity) || 1),
    stock: toStock(item.stock),
  };
}

function getStoredCartItems(storageKey) {
  if (!storageKey) return [];

  try {
    const storedItems = JSON.parse(localStorage.getItem(storageKey) || '[]');

    return Array.isArray(storedItems)
      ? storedItems.filter((item) => item && typeof item === 'object' && item.id != null).map(normalizeStoredCartItem)
      : [];
  } catch {
    return [];
  }
}

function loadCart(storageKey) {
  return { storageKey, items: getStoredCartItems(storageKey) };
}

export function CartProvider({ children }) {
  const authContext = useContext(AuthContext);
  const userId = authContext?.user?.id ?? null;
  const storageKey = getCartStorageKey(userId);

  // Items are read from storage during the first render (not in an effect), and
  // remember which key they came from, so the persist effect can never write an
  // empty or stale cart over another user's saved cart.
  const [cart, setCart] = useState(() => loadCart(storageKey));

  // Switch to the correct user's cart whenever the logged-in user changes.
  // A user who has never had items saved gets an empty cart here.
  if (cart.storageKey !== storageKey) {
    setCart(loadCart(storageKey));
  }

  const cartItems = cart.storageKey === storageKey ? cart.items : [];

  // Pricing rules come from the API so checkout totals match what Paystack charges.
  const [checkoutConfig, setCheckoutConfig] = useState({ currency: 'USD', shipping_flat_fee: 0, tax_rate: 0 });

  useEffect(() => {
    let isMounted = true;

    getPublicSettings()
      .then((settings) => {
        if (isMounted && settings?.checkout) {
          setCheckoutConfig(settings.checkout);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!cart.storageKey) return;
    localStorage.setItem(cart.storageKey, JSON.stringify(cart.items));
  }, [cart]);

  const setCartItems = useCallback((updater) => {
    setCart((current) => ({ ...current, items: updater(current.items) }));
  }, []);

  const addToCart = useCallback((product, quantity = 1, size = DEFAULT_CART_SIZE) => {
    setCartItems((items) => {
      const cartItemId = `${product.id || product.name}-${size}`;
      const existingItem = items.find((item) => item.cartItemId === cartItemId);
      const stock = toStock(product.stock);
      const maxQuantity = getMaxQuantity(stock);

      if (maxQuantity < 1) return items;

      if (existingItem) {
        return items.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: Math.min(item.quantity + quantity, maxQuantity), stock }
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
          price: toPriceNumber(product.price),
          quantity: Math.min(quantity, maxQuantity),
          size,
          stock,
        },
      ];
    });
  }, [setCartItems]);

  const increaseQuantity = useCallback((cartItemId) => {
    setCartItems((items) =>
      items.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: Math.min(item.quantity + 1, Math.max(1, getMaxQuantity(item.stock))) }
          : item,
      ),
    );
  }, [setCartItems]);

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
  }, [setCartItems]);

  const removeItem = useCallback((cartItemId) => {
    setCartItems((items) => items.filter((item) => item.cartItemId !== cartItemId));
  }, [setCartItems]);

  const clearCart = useCallback(() => {
    setCartItems(() => []);
  }, [setCartItems]);

  // Re-syncs cart lines with the live catalogue: updates price and stock, and drops
  // products that no longer exist. Network failures leave the cart untouched.
  const refreshCartItems = useCallback(async () => {
    try {
      const data = await getAllProducts();
      const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      const productsById = new Map(list.map((product) => {
        const normalized = normalizeProduct(product);
        return [normalized.id, normalized];
      }));

      setCartItems((items) =>
        items
          .filter((item) => productsById.has(String(item.id)))
          .map((item) => {
            const product = productsById.get(String(item.id));
            const stock = toStock(product.stock);
            const maxQuantity = getMaxQuantity(stock);

            return {
              ...item,
              price: toPriceNumber(product.price),
              stock,
              quantity: maxQuantity >= 1 ? Math.min(item.quantity, maxQuantity) : item.quantity,
            };
          }),
      );
    } catch {
      // Keep the stored prices; the API re-prices the order on submit anyway.
    }
  }, [setCartItems]);

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems],
  );

  const roundMoney = (value) => Math.round(value * 100) / 100;
  const currency = checkoutConfig.currency || 'USD';
  const shipping = subtotal > 0 ? Number(checkoutConfig.shipping_flat_fee) || 0 : 0;
  const estimatedTax = roundMoney(subtotal * (Number(checkoutConfig.tax_rate) || 0));
  const grandTotal = roundMoney(subtotal + shipping + estimatedTax);

  const value = useMemo(
    () => ({
      addToCart,
      cartItems,
      clearCart,
      currency,
      decreaseQuantity,
      estimatedTax,
      grandTotal,
      increaseQuantity,
      refreshCartItems,
      removeItem,
      shipping,
      subtotal,
    }),
    [
      addToCart,
      cartItems,
      clearCart,
      currency,
      decreaseQuantity,
      estimatedTax,
      grandTotal,
      increaseQuantity,
      refreshCartItems,
      removeItem,
      shipping,
      subtotal,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
