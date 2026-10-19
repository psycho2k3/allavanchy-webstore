import apiClient from './apiClient.js';
import { getUserToken } from './userAuth.js';

const getAuthHeaders = () => {
  const token = getUserToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Starts a Paystack checkout for an existing order and returns the
// Paystack-hosted payment page URL.
export const initializePayment = async (orderId) => {
  const response = await apiClient.post(
    '/api/payments/paystack/initialize',
    { order_id: orderId },
    { headers: getAuthHeaders() },
  );

  return response.data;
};

export const verifyPayment = async (reference) => {
  const response = await apiClient.get(
    `/api/payments/paystack/verify/${encodeURIComponent(reference)}`,
    { headers: getAuthHeaders() },
  );

  return response.data;
};

// Sends the browser to Paystack to pay for the given order.
export const redirectToPayment = async (orderId) => {
  const { authorization_url: authorizationUrl } = await initializePayment(orderId);
  window.location.assign(authorizationUrl);
};
