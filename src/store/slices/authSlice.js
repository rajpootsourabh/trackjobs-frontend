import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/api";

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);

      // Check if the service call was successful
      if (response.success) {
        return response.data; // This contains access_token, user, etc.
      } else {
        // Service returned success: false with an error message
        return rejectWithValue(response.message);
      }
    } catch (error) {
      // This catches actual thrown errors (network errors, etc.)
      return rejectWithValue(error.message);
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.logout();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  user: null,
  accessToken: null,
  tokenType: "bearer",
  expiresIn: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  uiContext: null,
  permissions: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Synchronous actions
    setCredentials: (state, action) => {
      const { access_token, user, token_type, expires_in } = action.payload;
      state.accessToken = access_token;
      state.user = user;
      state.tokenType = token_type;
      state.expiresIn = expires_in;
      state.isAuthenticated = true;

      // Extract permissions and UI context
      if (user?.permissions) {
        state.permissions = user.permissions;
      }
      if (user?.ui_context) {
        state.uiContext = user.ui_context;
      }

      // Persist to localStorage
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token_type", token_type);
      localStorage.setItem("expires_in", expires_in);
    },

    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.tokenType = "bearer";
      state.expiresIn = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
      state.uiContext = null;
      state.permissions = [];

      // Clear localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("token_type");
      localStorage.removeItem("expires_in");
      localStorage.removeItem("email");
    },

loadFromStorage: (state) => {
  const token = localStorage.getItem("access_token");
  const userStr = localStorage.getItem("user");
  
  console.log("=== LOAD FROM STORAGE ===");
  console.log("Token exists:", !!token);
  console.log("User exists:", !!userStr);
  console.log("Token value:", token ? "Present" : "Missing");
  console.log("User value:", userStr ? "Present" : "Missing");
  
  if (token && userStr) {
    console.log("Setting isAuthenticated to TRUE");
    state.isAuthenticated = true;
    // ... rest of your code
  } else {
    console.log("Setting isAuthenticated to FALSE");
    state.isAuthenticated = false;
  }
},

    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.access_token;
        state.user = action.payload.user;
        state.tokenType = action.payload.token_type;
        state.expiresIn = action.payload.expires_in;
        state.isAuthenticated = true;

        // Extract permissions and UI context
        if (action.payload.user?.permissions) {
          state.permissions = action.payload.user.permissions;
        }
        if (action.payload.user?.ui_context) {
          state.uiContext = action.payload.user.ui_context;
        }

        // Persist to localStorage
        localStorage.setItem("access_token", action.payload.access_token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token_type", action.payload.token_type);
        localStorage.setItem("expires_in", action.payload.expires_in);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.tokenType = "bearer";
        state.expiresIn = null;
        state.loading = false;
        state.error = null;
        state.isAuthenticated = false;
        state.uiContext = null;
        state.permissions = [];

        // Clear localStorage
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        localStorage.removeItem("token_type");
        localStorage.removeItem("expires_in");
        localStorage.removeItem("email");
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        // You might want to auto-login after registration
        // or just show success message
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCredentials,
  clearCredentials,
  loadFromStorage,
  updateUserProfile,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
