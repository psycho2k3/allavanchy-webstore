// productService.js

import api from "./api";

export const getProducts = () => api.get("/products");

export const getProduct = (id) =>
    api.get(`/products/${id}`);

export const createProduct = (data, token) =>
    api.post("/products", data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });

export const updateProduct = (id, data, token) =>
    api.put(`/products/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });

export const deleteProduct = (id, token) =>
    api.delete(`/products/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });