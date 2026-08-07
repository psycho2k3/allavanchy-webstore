import apiClient from './apiClient.js';
import { getUserToken } from './userAuth.js';

const getAuthHeaders = () => {
  const token = getUserToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

export const createOrder = async (payload) => {
  const response = await apiClient.post('/api/orders', payload, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const getMyOrders = async () => {
  const response = await apiClient.get('/api/orders/my-orders', {
    headers: getAuthHeaders(),
  });

  return response.data;
};