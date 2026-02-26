// store/slices/features/employeeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import employeeService from "../../../features/employees/services/employeeService";

// ===== ASYNC THUNKS =====

// Fetch employees with pagination
export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (
    { page = 1, perPage = 5, filters = {}, sort = {} } = {},
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

      const response = await employeeService.getAll(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch employees",
      );
    }
  },
);

// Fetch single employee
export const fetchEmployeeById = createAsyncThunk(
  "employees/fetchEmployeeById",
  async (id, { rejectWithValue }) => {
    try {
      const employee = await employeeService.getById(id);
      return employee;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch employee",
      );
    }
  },
);

// Create employee
export const createEmployee = createAsyncThunk(
  "employees/createEmployee",
  async (employeeData, { rejectWithValue }) => {
    try {
      const newEmployee = await employeeService.create(employeeData);
      return newEmployee;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create employee",
      );
    }
  },
);

// Update employee
export const updateEmployee = createAsyncThunk(
  "employees/updateEmployee",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const updatedEmployee = await employeeService.update(id, data);
      return updatedEmployee;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update employee",
      );
    }
  },
);

// Delete employee
export const deleteEmployee = createAsyncThunk(
  "employees/deleteEmployee",
  async (id, { rejectWithValue }) => {
    try {
      await employeeService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete employee",
      );
    }
  },
);

// ===== INITIAL STATE =====

const initialState = {
  employees: [],
  currentEmployee: null,
  pagination: {
    total: 0,
    perPage: 5,
    currentPage: 1,
    totalPages: 1,
    from: null,
    to: null,
  },
  loading: false,
  error: null,
  success: null,
  filters: {
    search: "",
    department: "",
    designation: "",
    is_active: "",
  },
  sort: {
    field: "created_at",
    direction: "desc",
  },
};

// ===== SLICE =====

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1; // Reset to first page on filter change
    },
    setSort: (state, action) => {
      state.sort = action.payload;
      state.pagination.currentPage = 1; // Reset to first page on sort change
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setPerPage: (state, action) => {
      state.pagination.perPage = action.payload;
      state.pagination.currentPage = 1; // Reset to first page when changing items per page
    },
    clearCurrentEmployee: (state) => {
      state.currentEmployee = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.sort = initialState.sort;
      state.pagination.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.data || [];
        
        // Update pagination
        if (action.payload.pagination) {
          state.pagination = {
            total: action.payload.pagination.total || 0,
            perPage: action.payload.pagination.perPage || state.pagination.perPage,
            currentPage: action.payload.pagination.currentPage || 1,
            totalPages: action.payload.pagination.totalPages || 1,
            from: action.payload.pagination.from || null,
            to: action.payload.pagination.to || null,
          };
        }
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Employee
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEmployee = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Employee
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.unshift(action.payload);
        state.pagination.total += 1;
        state.success = "Employee created successfully";
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Employee
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employees.findIndex(
          (e) => e.id === action.payload.id,
        );
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
        if (state.currentEmployee?.id === action.payload.id) {
          state.currentEmployee = action.payload;
        }
        state.success = "Employee updated successfully";
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Employee
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter((e) => e.id !== action.payload);
        state.pagination.total -= 1;
        if (state.currentEmployee?.id === action.payload) {
          state.currentEmployee = null;
        }
        state.success = "Employee deleted successfully";
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setFilters, 
  setSort, 
  setCurrentPage,
  setPerPage,
  clearCurrentEmployee, 
  clearError,
  clearSuccess,
  resetFilters 
} = employeeSlice.actions;

export default employeeSlice.reducer;