import apiClient from './apiClient.js';

export const getAllCollections = async () => {
  const response = await apiClient.get('/api/collections');
  return response.data;
};

export const getCollectionById = async (id) => {
  const response = await apiClient.get(`/api/collections/${id}`);
  return response.data;
};