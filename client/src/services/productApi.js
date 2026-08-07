import apiClient from './apiClient.js';

export const getAllProducts = async () => {
  const response = await apiClient.get('/api/products');
  return response.data;
};

export const getProductById = async (id) => {
  const response = await apiClient.get(`/api/products/${id}`);
  return response.data;
};

export const normalizeProduct = (product) => ({
  id: String(product.id),
  name: product.name,
  category: product.category || 'Uncategorized',
  price: Number(product.price),
  description: product.description,
  sizes: Array.isArray(product.sizes) ? product.sizes : [],
  stock: Number(product.stock),
  image: product.image_url,
  gallery: product.image_url ? [product.image_url] : [],
});