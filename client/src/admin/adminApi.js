import apiClient from "../services/apiClient.js";
import { getAdminToken, getAdminUser, saveAdminSession } from "./adminAuth.js";

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

export const getDashboard = async () => {
  const response = await apiClient.get("/api/admin/dashboard", {
    headers: getAuthHeaders(),
  });

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

export const getUsers = async ({ search, role, status } = {}) => {
  const response = await apiClient.get("/api/admin/users", {
    headers: getAuthHeaders(),
    params: { search, role, status },
  });

  return response.data;
};

export const getUser = async (id) => {
  const response = await apiClient.get(`/api/admin/users/${id}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const updateUserRole = async (id, role) => {
  const response = await apiClient.patch(
    `/api/admin/users/${id}/role`,
    { role },
    { headers: getAuthHeaders() },
  );

  return response.data;
};

export const updateUserStatus = async (id, status) => {
  const response = await apiClient.patch(
    `/api/admin/users/${id}/status`,
    { status },
    { headers: getAuthHeaders() },
  );

  return response.data;
};

export const updateAdminProfile = async (payload) => {
  const response = await apiClient.patch("/api/admin/profile", payload, {
    headers: getAuthHeaders(),
  });

  const updatedUser = response.data;
  const currentUser = getAdminUser();

  // Keep the locally stored admin session in sync with any changed name/email.
  saveAdminSession({
    token: getAdminToken(),
    user: { ...currentUser, ...updatedUser },
  });

  return updatedUser;
};