import apiClient from "./apiClient.js";

export const sendContactMessage = async (contactData) => {
  const response = await apiClient.post(
    "/api/contact",
    contactData
  );

  return response.data;
};