import apiClient from './apiClient.js';

export const sendContactMessage = async (payload) => {
  const response = await apiClient.post('/api/contact', payload);
  return response.data;
};