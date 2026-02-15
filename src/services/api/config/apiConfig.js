// services/api/config/apiConfig.js
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false, // Set to true if using cookies
};

export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    logout: "/api/auth/logout",
    refresh: "/api/auth/refresh",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",
  },
  clients: {
    base: "/api/clients",
    get: (id) => `/api/clients/${id}`,
    create: "/api/clients",
    update: (id) => `/api/clients/${id}`,
    delete: (id) => `/api/clients/${id}`,
  },
  quotes: {
    base: "/api/quotes",
    get: (id) => `/api/quotes/${id}`,
    create: "/api/quotes",
    update: (id) => `/api/quotes/${id}`,
    delete: (id) => `/api/quotes/${id}`,
    send: (id) => `/api/quotes/${id}/send`,
  },
  // Add other endpoints...
};
