import axios from "axios";

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://allavanchy-api.onrender.com",

  headers: {
    Accept: "application/json",
  },
});

export default apiClient;