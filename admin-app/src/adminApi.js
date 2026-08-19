import apiClient from "./apiClient.js";
import {
  getAdminToken,
  getAdminUser,
  saveAdminSession,
} from "./adminAuth.js";

const getAuthHeaders = () => {
  const token = getAdminToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// =====================================================
// AUTH
// =====================================================

export const loginAdmin = async (credentials) => {
  const response = await apiClient.post(
    "/api/auth/login",
    credentials,
  );

  return response.data;
};

// =====================================================
// DASHBOARD
// =====================================================

export const getDashboard = async () => {
  const response = await apiClient.get(
    "/api/admin/dashboard",
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

// =====================================================
// PRODUCTS
// =====================================================

export const getProducts = async () => {
  const response = await apiClient.get(
    "/api/products",
  );

  return response.data;
};

export const getProduct = async (id) => {
  const response = await apiClient.get(
    `/api/products/${id}`,
  );

  return response.data;
};

// -----------------------------------------------------
// CREATE PRODUCT
// -----------------------------------------------------

export const createProduct = async (formData) => {
  if (!(formData instanceof FormData)) {
    throw new Error(
      "createProduct expects FormData",
    );
  }

  // DEBUG: Display everything being submitted
  console.log(
    "========================================",
  );
  console.log("CREATE PRODUCT - REQUEST DATA");
  console.log(
    "========================================",
  );

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`${key}:`, {
        fileName: value.name,
        fileType: value.type,
        fileSize: value.size,
      });
    } else {
      console.log(`${key}:`, value);
    }
  }

  console.log(
    "========================================",
  );

  try {
    const response = await apiClient.post(
      "/api/products",
      formData,
      {
        headers: getAuthHeaders(),
      },
    );

    console.log(
      "========================================",
    );
    console.log("CREATE PRODUCT - SUCCESS");
    console.log(
      "========================================",
    );
    console.log(response.data);

    return response.data;

  } catch (error) {
    console.error(
      "========================================",
    );
    console.error("CREATE PRODUCT - ERROR");
    console.error(
      "========================================",
    );

    console.error(
      "HTTP Status:",
      error.response?.status,
    );

    console.error(
      "Backend Response:",
      error.response?.data,
    );

    console.error(
      "Error Message:",
      error.message,
    );

    console.error(
      "Request URL:",
      error.config?.url,
    );

    console.error(
      "Request Method:",
      error.config?.method,
    );

    throw error;
  }
};

// -----------------------------------------------------
// UPDATE PRODUCT
// -----------------------------------------------------

export const updateProduct = async (
  id,
  formData,
) => {
  if (!(formData instanceof FormData)) {
    throw new Error(
      "updateProduct expects FormData",
    );
  }

  console.log(
    "========================================",
  );
  console.log("UPDATE PRODUCT - REQUEST DATA");
  console.log(
    "========================================",
  );

  console.log("Product ID:", id);

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`${key}:`, {
        fileName: value.name,
        fileType: value.type,
        fileSize: value.size,
      });
    } else {
      console.log(`${key}:`, value);
    }
  }

  try {
    const response = await apiClient.put(
      `/api/products/${id}`,
      formData,
      {
        headers: getAuthHeaders(),
      },
    );

    console.log(
      "UPDATE PRODUCT - SUCCESS",
      response.data,
    );

    return response.data;

  } catch (error) {
    console.error(
      "========================================",
    );
    console.error("UPDATE PRODUCT - ERROR");
    console.error(
      "========================================",
    );

    console.error(
      "HTTP Status:",
      error.response?.status,
    );

    console.error(
      "Backend Response:",
      error.response?.data,
    );

    console.error(
      "Error Message:",
      error.message,
    );

    throw error;
  }
};

export const deleteProduct = async (id) => {
  const response = await apiClient.delete(
    `/api/products/${id}`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

// =====================================================
// USERS
// =====================================================

export const getUsers = async ({
  search,
  role,
  status,
} = {}) => {
  const response = await apiClient.get(
    "/api/admin/users",
    {
      headers: getAuthHeaders(),
      params: {
        search,
        role,
        status,
      },
    },
  );

  return response.data;
};

export const getUser = async (id) => {
  const response = await apiClient.get(
    `/api/admin/users/${id}`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

export const updateUserRole = async (
  id,
  role,
) => {
  const response = await apiClient.patch(
    `/api/admin/users/${id}/role`,
    {
      role,
    },
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

export const updateUserStatus = async (
  id,
  status,
) => {
  const response = await apiClient.patch(
    `/api/admin/users/${id}/status`,
    {
      status,
    },
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

// =====================================================
// ADMIN PROFILE
// =====================================================

export const updateAdminProfile = async (
  payload,
) => {
  const response = await apiClient.patch(
    "/api/admin/profile",
    payload,
    {
      headers: getAuthHeaders(),
    },
  );

  const updatedUser = response.data;
  const currentUser = getAdminUser();

  saveAdminSession({
    token: getAdminToken(),
    user: {
      ...currentUser,
      ...updatedUser,
    },
  });

  return updatedUser;
};

// =====================================================
// ORDERS
// =====================================================

export const getOrders = async ({
  search,
  status,
} = {}) => {
  const response = await apiClient.get(
    "/api/admin/orders",
    {
      headers: getAuthHeaders(),
      params: {
        search,
        status,
      },
    },
  );

  return response.data;
};

export const getOrder = async (id) => {
  const response = await apiClient.get(
    `/api/admin/orders/${id}`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

export const updateOrderStatus = async (
  id,
  status,
) => {
  const response = await apiClient.patch(
    `/api/admin/orders/${id}/status`,
    {
      status,
    },
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

// =====================================================
// SETTINGS
// =====================================================

export const getAdminSettings = async () => {
  const response = await apiClient.get(
    "/api/admin/settings",
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

export const updateSettings = async (
  payload,
) => {
  const response = await apiClient.patch(
    "/api/admin/settings",
    payload,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

export const updateLandingImage = async (
  file,
) => {
  const formData = new FormData();

  formData.append("image", file);

  const response = await apiClient.patch(
    "/api/admin/settings/landing-image",
    formData,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

export const updateHeroImage = async (
  file,
) => {
  const formData = new FormData();

  formData.append("image", file);

  const response = await apiClient.patch(
    "/api/admin/settings/hero-image",
    formData,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

// =====================================================
// COLLECTIONS
// =====================================================

export const getAdminCollections = async () => {
  const response = await apiClient.get(
    "/api/admin/collections",
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

export const getAdminCollection = async (
  id,
) => {
  const response = await apiClient.get(
    `/api/admin/collections/${id}`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

export const createCollection = async (
  formData,
) => {
  const response = await apiClient.post(
    "/api/admin/collections",
    formData,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

export const updateCollection = async (
  id,
  formData,
) => {
  const response = await apiClient.put(
    `/api/admin/collections/${id}`,
    formData,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

export const deleteCollection = async (
  id,
) => {
  const response = await apiClient.delete(
    `/api/admin/collections/${id}`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

export const setCollectionProducts = async (
  id,
  productIds,
) => {
  const response = await apiClient.put(
    `/api/admin/collections/${id}/products`,
    {
      productIds,
    },
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};