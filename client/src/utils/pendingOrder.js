// Remembers the unpaid order created for the current cart so that coming back
// from Paystack (browser back button) reuses it instead of creating a duplicate.
const PENDING_ORDER_KEY = 'allavanchy-pending-order';

export const readPendingOrder = () => {
  try {
    return JSON.parse(sessionStorage.getItem(PENDING_ORDER_KEY) || 'null');
  } catch {
    return null;
  }
};

export const savePendingOrder = (orderId, signature) => {
  try {
    sessionStorage.setItem(PENDING_ORDER_KEY, JSON.stringify({ orderId, signature }));
  } catch {
    // Storage can be unavailable (private mode); checkout still works without it.
  }
};

export const clearPendingOrder = () => {
  try {
    sessionStorage.removeItem(PENDING_ORDER_KEY);
  } catch {
    // Ignore storage errors.
  }
};
