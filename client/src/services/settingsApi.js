import apiClient from './apiClient.js';

export const getPublicSettings = async () => {
  const response = await apiClient.get('/api/settings');
  return response.data;
};