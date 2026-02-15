// services/api/httpClient.js
import axios from "axios";
import { API_CONFIG } from "./config/apiConfig";
import { 
  requestInterceptor, 
  requestErrorInterceptor 
} from "./interceptors/requestInterceptor";
import { responseInterceptor } from "./interceptors/responseInterceptor";
import { errorInterceptor } from "./interceptors/errorInterceptor";

// Create axios instance with base configuration
const httpClient = axios.create(API_CONFIG);

// Add request interceptor
httpClient.interceptors.request.use(
  requestInterceptor,
  requestErrorInterceptor
);

// Add response interceptor
httpClient.interceptors.response.use(
  responseInterceptor,
  errorInterceptor
);

// Export different instances for different use cases if needed
export const publicClient = axios.create({
  ...API_CONFIG,
  // No auth headers for public endpoints
});

export const fileUploadClient = axios.create({
  ...API_CONFIG,
  headers: {
    ...API_CONFIG.headers,
    "Content-Type": "multipart/form-data",
  },
});

// Add interceptors to other instances if needed
fileUploadClient.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
fileUploadClient.interceptors.response.use(responseInterceptor, errorInterceptor);

export default httpClient;