import axios from 'axios';
import { clearUserSession } from './userAuth.js';

export const SESSION_EXPIRED_EVENT = 'allavanchy:logout';

const resolveBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;

  if (import.meta.env.DEV) return 'http://localhost:5000';

  console.error('VITE_API_BASE_URL is not set. The storefront cannot reach the API in this build.');
  return '';
};

const apiClient = axios.create({
  baseURL: resolveBaseUrl(),
});

const hasAuthorizationHeader = (config) => {
  const headers = config?.headers;
  if (!headers) return false;

  return Boolean(
    (typeof headers.get === 'function' && headers.get('Authorization')) || headers.Authorization,
  );
};

// A 401 on an authenticated request means the session expired or the account was
// deactivated. Clear it and let AuthContext drop the user.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && hasAuthorizationHeader(error.config)) {
      clearUserSession();
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }

    return Promise.reject(error);
  },
);

// Server error bodies are { message } (plus `error` outside production).
export const getApiErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.error || fallback;

export default apiClient;
