import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const setPassword = async (data) => {
  try {
    const response = await apiClient.patch("/api/intern/set-password", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateProfile = async (data) => {
  try {
    const response = await apiClient.patch("/api/intern/profile", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
