import apiClient from "../services/apiClient.js";
import { getAdminToken } from "./adminAuth.js";

const getAuthHeaders = () => {
  const token = getAdminToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

export const loginAdmin = async (credentials) => {
  const response = await apiClient.post("/api/auth/login", credentials);
  return response.data;
};

export const getProducts = async () => {
  const response = await apiClient.get("/api/products");
  return response.data;
};

export const getProduct = async (id) => {
  const response = await apiClient.get(`/api/products/${id}`);
  return response.data;
};

export const createProduct = async (formData) => {
  const response = await apiClient.post("/api/products", formData, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await apiClient.put(`/api/products/${id}`, data, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await apiClient.delete(`/api/products/${id}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};
