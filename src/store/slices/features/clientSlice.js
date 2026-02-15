// store/slices/features/clientSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import clientService from "../../../features/clients/services/clientService";

// ===== ASYNC THUNKS =====

// Fetch clients with pagination
export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async (
    { page = 1, perPage = 15, filters = {}, sort = {} } = {},
    { rejectWithValue },
  ) => {
    try {
      const params = {
        page,
        per_page: perPage,
        ...filters,
        sort_by: sort.field,
        sort_direction: sort.direction,
      };

      const response = await clientService.getAll(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch clients",
      );
    }
  },
);

// Fetch single client
export const fetchClientById = createAsyncThunk(
  "clients/fetchClientById",
  async (id, { rejectWithValue }) => {
    try {
      const client = await clientService.getById(id);
      return client;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch client",
      );
    }
  },
);

// Create client
export const createClient = createAsyncThunk(
  "clients/createClient",
  async (clientData, { rejectWithValue }) => {
    try {
      const newClient = await clientService.create(clientData);
      return newClient;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create client",
      );
    }
  },
);

// Update client
export const updateClient = createAsyncThunk(
  "clients/updateClient",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const updatedClient = await clientService.update(id, data);
      return updatedClient;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update client",
      );
    }
  },
);

// Delete client
export const deleteClient = createAsyncThunk(
  "clients/deleteClient",
  async (id, { rejectWithValue }) => {
    try {
      await clientService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete client",
      );
    }
  },
);

// ===== INITIAL STATE =====

const initialState = {
  clients: [],
  currentClient: null,
  pagination: {
    total: 0,
    perPage: 15,
    currentPage: 1,
    totalPages: 1,
  },
  loading: false,
  error: null,
  filters: {
    search: "",
    status: "",
    category: "",
  },
  sort: {
    field: "created_at",
    direction: "desc",
  },
};

// ===== SLICE =====

const clientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    clearCurrentClient: (state) => {
      state.currentClient = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Clients
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Client
      .addCase(fetchClientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClient = action.payload;
      })
      .addCase(fetchClientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Client
      .addCase(createClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.loading = false;
        state.clients.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Client
      .addCase(updateClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.clients.findIndex(
          (c) => c.id === action.payload.id,
        );
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
        if (state.currentClient?.id === action.payload.id) {
          state.currentClient = action.payload;
        }
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Client
      .addCase(deleteClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = state.clients.filter((c) => c.id !== action.payload);
        state.pagination.total -= 1;
        if (state.currentClient?.id === action.payload) {
          state.currentClient = null;
        }
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, setSort, clearCurrentClient, clearError } =
  clientSlice.actions;
export default clientSlice.reducer;
