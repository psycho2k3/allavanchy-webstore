import apiClient from './apiClient.js';

export const getAllProducts = async () => {
  const response = await apiClient.get('/api/products');

  return response.data;
};

export const getProductById = async (id) => {
  const response = await apiClient.get(
    `/api/products/${id}`
  );

  return response.data;
};

/*
 * Normalize product data for the storefront.
 *
 * Products now support multiple images through
 * the image_urls PostgreSQL array.
 *
 * image_url remains the primary/legacy image.
 */
export const normalizeProduct = (product) => {
  /*
   * Use the new multiple-image field first.
   *
   * If image_urls exists and contains images,
   * use all of them.
   *
   * Otherwise fall back to image_url so older
   * products continue to work.
   */
  const gallery =
    Array.isArray(product.image_urls) &&
    product.image_urls.length > 0
      ? product.image_urls.filter(Boolean)
      : product.image_url
        ? [product.image_url]
        : [];

  return {
    id: String(product.id),

    name: product.name,

    category:
      product.category || 'Uncategorized',

    price: Number(product.price),

    description:
      product.description || '',

    sizes:
      Array.isArray(product.sizes)
        ? product.sizes
        : [],

    stock: Number(product.stock),

    /*
     * The first image is always treated as
     * the primary product image.
     */
    image: gallery[0] || '',

    /*
     * All product images.
     */
    gallery,
  };
};