// services/api/interceptors/errorInterceptor.js
export const errorInterceptor = async (error) => {
  // Log in development
  if (process.env.NODE_ENV === "development") {
    console.error("[API Error]", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
  }

  // Handle specific error cases
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 401:
        return handleUnauthorized(error);

      case 403:
        return handleForbidden(error);

      case 422:
        return handleValidationError(error);

      case 429:
        return handleRateLimit(error);

      case 500:
        return handleServerError(error);

      default:
        return handleGenericError(error);
    }
  } else if (error.request) {
    // Network error - no response received
    return handleNetworkError(error);
  } else {
    // Request setup error
    return handleSetupError(error);
  }
};

// Specific error handlers
const handleUnauthorized = async (error) => {
  // Try to refresh token
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      const response = await axios.post("/api/auth/refresh", {
        refresh_token: refreshToken,
      });

      localStorage.setItem("access_token", response.data.access_token);

      // Retry the original request
      error.config.headers.Authorization = `Bearer ${response.data.access_token}`;
      return axios(error.config);
    }
  } catch (refreshError) {
    // Refresh failed, logout user
    clearAuthData();
  }

  // No refresh token or refresh failed
  clearAuthData();
  redirectToLogin();
  return Promise.reject(error);
};

const handleForbidden = (error) => {
  // Log to monitoring service
  console.warn("Access forbidden:", error.response?.data?.message);
  return Promise.reject(error);
};

const handleValidationError = (error) => {
  // Transform validation errors for easier handling in components
  const validationErrors = error.response?.data?.errors || {};
  error.validationErrors = validationErrors;
  return Promise.reject(error);
};

const handleRateLimit = (error) => {
  // Show user-friendly message
  error.userMessage = "Too many requests. Please try again later.";
  return Promise.reject(error);
};

const handleServerError = (error) => {
  error.userMessage = "Server error. Please try again later.";
  return Promise.reject(error);
};

const handleNetworkError = (error) => {
  error.userMessage = "Network error. Please check your connection.";
  return Promise.reject(error);
};

const handleGenericError = (error) => {
  error.userMessage = "An unexpected error occurred.";
  return Promise.reject(error);
};

const handleSetupError = (error) => {
  error.userMessage = "Request configuration error.";
  return Promise.reject(error);
};

// Helper functions
const clearAuthData = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};

const redirectToLogin = () => {
  if (!window.location.pathname.includes("/signin")) {
    window.location.href = "/signin";
  }
};
