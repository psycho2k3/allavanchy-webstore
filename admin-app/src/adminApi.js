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
// ERRORS
// =====================================================

/*
 * Turns an axios error into a message that is safe to show
 * to the admin. Requests that never got a response (CORS,
 * network, oversized uploads dropped by a proxy) and
 * timeouts get explicit explanations.
 */
export const getApiErrorMessage = (
  error,
  fallback = "Something went wrong.",
) => {
  if (error?.code === "ECONNABORTED") {
    return "The request timed out. Large uploads can take a while; please try again with fewer or smaller images.";
  }

  if (!error?.response) {
    if (error?.request) {
      return "Could not reach the server. The upload may be too large, timed out, or blocked (check CORS_ALLOWED_ORIGINS).";
    }

    return error?.message || fallback;
  }

  const { data, status } = error.response;

  const details =
    data && typeof data === "object" && Array.isArray(data.errors)
      ? data.errors.join(", ")
      : "";

  const message =
    (data && typeof data === "object"
      ? data.message || data.error
      : "") || fallback;

  const fullMessage = details && !message.includes(details)
    ? `${message}: ${details}`
    : message;

  return status ? `${fullMessage} (HTTP ${status})` : fullMessage;
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

  const response = await apiClient.post(
    "/api/products",
    formData,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
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

  const response = await apiClient.put(
    `/api/products/${id}`,
    formData,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
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
  page,
  limit,
  search,
  role,
  status,
} = {}) => {
  const response = await apiClient.get(
    "/api/admin/users",
    {
      headers: getAuthHeaders(),
      params: {
        page,
        limit,
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
  page,
  limit,
  search,
  status,
} = {}) => {
  const response = await apiClient.get(
    "/api/admin/orders",
    {
      headers: getAuthHeaders(),
      params: {
        page,
        limit,
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

const DEFAULT_CURRENCY = "USD";

let checkoutCurrencyPromise = null;

/*
 * The store currency comes from the public settings
 * endpoint (checkout.currency). It is fetched once per
 * page load and shared by every screen.
 */
export const getCheckoutCurrency = () => {
  if (!checkoutCurrencyPromise) {
    checkoutCurrencyPromise = apiClient
      .get("/api/settings")
      .then((response) => {
        const currency = response.data?.checkout?.currency;

        return typeof currency === "string" && currency.trim()
          ? currency.trim().toUpperCase()
          : DEFAULT_CURRENCY;
      })
      .catch(() => {
        // Allow a later retry instead of caching the failure.
        checkoutCurrencyPromise = null;
        return DEFAULT_CURRENCY;
      });
  }

  return checkoutCurrencyPromise;
};

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
