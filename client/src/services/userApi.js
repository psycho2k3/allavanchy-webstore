import apiClient from './apiClient.js';

export const registerUser = async (payload) => {
  const response = await apiClient.post('/api/auth/register', payload);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await apiClient.post('/api/auth/login', credentials);
  return response.data;
};