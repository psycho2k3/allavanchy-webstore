import axios from "axios";
import { clearAdminSession } from "./adminAuth.js";

const LOGIN_PATH = "/login";

const resolveBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL;

  if (configuredUrl) {
    return configuredUrl;
  }

  if (import.meta.env.DEV) {
    return "http://localhost:5000";
  }

  console.error(
    "VITE_API_BASE_URL is not set. The admin app cannot reach the API until it is configured for this deployment.",
  );

  return "";
};

const apiClient = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 60000,

  headers: {
    Accept: "application/json",
  },
});

// An expired or revoked session surfaces as a 401 on any admin request.
// Login failures are also 401s, so those are left for the login form to show.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    if (status === 401 && !requestUrl.includes("/api/auth/login")) {
      clearAdminSession();

      if (window.location.pathname !== LOGIN_PATH) {
        window.location.assign(LOGIN_PATH);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
