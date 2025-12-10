import axios from "axios";

const API_URL = "https://localhost:7074/api/Registration";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  // ❌ REMOVE Content-Type
  // headers: { "Content-Type": "multipart/form-data" },
});

export const registerStudent = async (formData) => {
  try {
    const response = await api.post("/register", formData, {
      headers: {
        // Let Axios auto-set correct boundary
        "Content-Type": undefined,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};
