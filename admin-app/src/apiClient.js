import axios from "axios";

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://allavanchy-api.vercel.app",

  headers: {
    Accept: "application/json",
  },
});

export default apiClient;