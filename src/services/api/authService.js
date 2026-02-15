import httpClient from "./httpClient";

class AuthService {
  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} Response object
   */
  async login(credentials) {
    try {
      const response = await httpClient.post("/api/v1/auth/login", credentials);

      if (response.data.success) {
        // Store email for remember me feature
        if (credentials.rememberMe) {
          localStorage.setItem("email", credentials.email);
        } else {
          localStorage.removeItem("email");
        }

        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      }

      // Return failure WITHOUT throwing an error
      return {
        success: false,
        data: null,
        message: response.data.message || "Invalid credentials",
      };
    } catch (error) {
      console.error("AuthService.login error:", error);

      let message = "Login failed";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle Laravel validation errors
        const firstKey = Object.keys(error.response.data.errors)[0];
        message = error.response.data.errors[firstKey]?.[0] || message;
      } else if (error.message) {
        message = error.message;
      }

      return {
        success: false,
        data: null,
        message,
      };
    }
  }

  /**
   * Register new user
   * @param {Object} userData - Registration data
   * @returns {Promise<Object>} Response object
   */
  async register(userData) {
    try {
      const response = await httpClient.post("/api/v1/auth/register", userData);

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      }

      return {
        success: false,
        data: null,
        message: response.data.message || "Registration failed",
      };
    } catch (error) {
      console.error("AuthService.register error:", error);

      let message = "Registration failed";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle Laravel validation errors
        const firstKey = Object.keys(error.response.data.errors)[0];
        message = error.response.data.errors[firstKey]?.[0] || message;
      } else if (error.message) {
        message = error.message;
      }

      return {
        success: false,
        data: null,
        message,
      };
    }
  }

  /**
   * Logout user
   * @returns {Promise<Object>} Response object
   */
  async logout() {
    try {
      const response = await httpClient.post("/api/v1/auth/logout");

      if (response.data.success) {
        // Clear local storage
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        localStorage.removeItem("token_type");
        localStorage.removeItem("expires_in");

        return {
          success: true,
          data: null,
          message: response.data.message || "Logged out successfully",
        };
      }

      return {
        success: false,
        data: null,
        message: response.data.message || "Logout failed",
      };
    } catch (error) {
      console.error("AuthService.logout error:", error);

      // Even if API fails, clear local storage
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("token_type");
      localStorage.removeItem("expires_in");

      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || error.message || "Logout failed",
      };
    }
  }

  /**
   * Refresh token
   * @returns {Promise<Object>} Response object
   */
  async refreshToken() {
    try {
      const response = await httpClient.post("/api/v1/auth/refresh");

      if (response.data.success) {
        localStorage.setItem("access_token", response.data.data.access_token);
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      }

      return {
        success: false,
        data: null,
        message: response.data.message || "Token refresh failed",
      };
    } catch (error) {
      console.error("AuthService.refreshToken error:", error);

      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message ||
          error.message ||
          "Token refresh failed",
      };
    }
  }

  /**
   * Get current user from localStorage
   * @returns {Object|null} User object or null
   */
  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Get auth token
   * @returns {string|null} Token or null
   */
  getToken() {
    return localStorage.getItem("access_token");
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  /**
   * Check if user has specific permission
   * @param {string} permission - Permission to check
   * @returns {boolean} True if user has permission
   */
  hasPermission(permission) {
    const user = this.getCurrentUser();
    if (!user?.permissions) return false;
    return user.permissions.includes(permission);
  }

  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {boolean} True if user has role
   */
  hasRole(role) {
    const user = this.getCurrentUser();
    if (!user?.role_slugs) return false;
    return user.role_slugs.includes(role);
  }

  /**
   * Get user's UI context
   * @returns {Object|null} UI context or null
   */
  getUiContext() {
    const user = this.getCurrentUser();
    return user?.ui_context || null;
  }
}

export default new AuthService();
