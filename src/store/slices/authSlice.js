// store/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../features/auth/services/authService";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response.data;
    } catch (error) {
      // Error already has the server response structure
      return rejectWithValue({
        message: error.response?.data?.message || "Login failed",
        errors: error.response?.data?.errors || {},
        code: error.response?.data?.code || error.code,
        timestamp: error.response?.data?.timestamp,
        error_code: error.response?.data?.error_code,
        status: error.response?.status
      });
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Registration failed",
        errors: error.response?.data?.errors || {},
        code: error.response?.data?.code || error.code,
        timestamp: error.response?.data?.timestamp,
        error_code: error.response?.data?.error_code
      });
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(email);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to send reset email",
        errors: error.response?.data?.errors || {},
        code: error.response?.data?.code || error.code
      });
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(data);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to reset password",
        errors: error.response?.data?.errors || {},
        code: error.response?.data?.code || error.code
      });
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.logout();
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Logout failed",
        code: error.response?.data?.code || error.code
      });
    }
  }
);

const initialState = {
  user: null,
  accessToken: localStorage.getItem("access_token"),
  loading: false,
  error: null,
  validationErrors: {},
  success: null,
  isAuthenticated: !!localStorage.getItem("access_token"),
  permissions: [],
  uiContext: "default",
  emailForReset: null,
  lastErrorCode: null,
  lastErrorTimestamp: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.validationErrors = {};
      state.lastErrorCode = null;
      state.lastErrorTimestamp = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setEmailForReset: (state, action) => {
      state.emailForReset = action.payload;
    },
    loadFromStorage: (state) => {
      const token = localStorage.getItem("access_token");
      const userStr = localStorage.getItem("user");

      if (token && userStr) {
        try {
          state.accessToken = token;
          state.user = JSON.parse(userStr);
          state.isAuthenticated = true;
        } catch (e) {
          console.error("Failed to parse user from storage:", e);
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = {};
        state.lastErrorCode = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        state.error = null;
        state.validationErrors = {};
        state.lastErrorCode = null;

        localStorage.setItem("access_token", action.payload.access_token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        
        // Store full error details
        state.error = action.payload?.message || "Login failed";
        state.validationErrors = action.payload?.errors || {};
        state.lastErrorCode = action.payload?.code || action.payload?.status;
        state.lastErrorTimestamp = action.payload?.timestamp;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = {};
        state.lastErrorCode = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Registration successful";
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
        state.validationErrors = action.payload?.errors || {};
        state.lastErrorCode = action.payload?.code;
        state.lastErrorTimestamp = action.payload?.timestamp;
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = {};
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload?.message || "Password reset email sent";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to send reset email";
        state.validationErrors = action.payload?.errors || {};
        state.lastErrorCode = action.payload?.code;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = {};
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload?.message || "Password reset successful";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to reset password";
        state.validationErrors = action.payload?.errors || {};
        state.lastErrorCode = action.payload?.code;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        Object.assign(state, {
          ...initialState,
          accessToken: null,
          isAuthenticated: false,
        });
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        localStorage.removeItem("token_type");
        localStorage.removeItem("expires_in");
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Logout failed";
        state.lastErrorCode = action.payload?.code;
        
        // Still clear local state
        Object.assign(state, {
          ...initialState,
          accessToken: null,
          isAuthenticated: false,
        });
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        localStorage.removeItem("token_type");
        localStorage.removeItem("expires_in");
      });
  },
});

export const { clearError, clearSuccess, setEmailForReset, loadFromStorage } = authSlice.actions;
export default authSlice.reducer;