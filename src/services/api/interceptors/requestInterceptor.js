// services/api/interceptors/requestInterceptor.js
export const requestInterceptor = (config) => {
  // Get token from localStorage
  const token = localStorage.getItem("access_token");

  // If token exists, add it to headers
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add request timestamp for performance monitoring
  config.metadata = { startTime: new Date() };

  // Add request ID for tracing (useful for debugging)
  config.headers['X-Request-ID'] = crypto.randomUUID?.() || 
    Date.now().toString(36) + Math.random().toString(36).substr(2);

  return config;
};

export const requestErrorInterceptor = (error) => {
  console.error("Request interceptor error:", error);
  return Promise.reject(error);
};