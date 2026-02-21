// services/api/uploadClient.js
import axios from "axios";

// Create a completely fresh client with NO default headers
const uploadClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
  timeout: 60000, // Longer timeout for uploads
  // DON'T set any default headers - let the browser handle Content-Type
  headers: {
    // Only set Accept header
    Accept: "application/json",
    // NO Content-Type header - this is crucial!
  },
});

// Add minimal interceptors
uploadClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // CRITICAL: For FormData, ensure NO Content-Type header is set
  if (config.data instanceof FormData) {
    // Delete ALL possible Content-Type headers
    delete config.headers["Content-Type"];
    delete config.headers["content-type"];
    delete config.headers["Content-type"];

    // Also delete from common headers if they exist
    if (config.headers.common) {
      delete config.headers.common["Content-Type"];
      delete config.headers.common["content-type"];
    }

    console.log("📦 Upload client sending FormData with fields:");
    for (let pair of config.data.entries()) {
      console.log(
        `   ${pair[0]}: ${pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]}`,
      );
    }
  }

  return config;
});

uploadClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Upload client error:", error);
    return Promise.reject(error);
  },
);

export default uploadClient;
