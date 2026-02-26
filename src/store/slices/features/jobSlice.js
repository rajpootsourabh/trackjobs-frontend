import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jobService from "../../../features/jobs/services/jobService";

// ===== ASYNC THUNKS =====

// Fetch jobs with pagination
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
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

      const response = await jobService.getAll(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch jobs",
      );
    }
  },
);

// Fetch single job
export const fetchJobById = createAsyncThunk(
  "jobs/fetchJobById",
  async (id, { rejectWithValue }) => {
    try {
      const job = await jobService.getById(id);
      return job;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch job",
      );
    }
  },
);

// Create job
export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const newJob = await jobService.create(jobData);
      return newJob;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create job",
      );
    }
  },
);

// Update job
export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const updatedJob = await jobService.update(id, data);
      return updatedJob;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update job",
      );
    }
  },
);

// Delete job
export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (id, { rejectWithValue }) => {
    try {
      await jobService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete job",
      );
    }
  },
);

// Update job status - THIS IS THE THUNK
export const updateJobStatus = createAsyncThunk(
  "jobs/updateJobStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await jobService.updateJobStatus(id, status);
      return { id, status, ...response };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update job status",
      );
    }
  },
);

// Task management
export const addTask = createAsyncThunk(
  "jobs/addTask",
  async ({ jobId, taskData }, { rejectWithValue }) => {
    try {
      const response = await jobService.addTask(jobId, taskData);
      return { jobId, task: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add task",
      );
    }
  },
);

export const toggleTask = createAsyncThunk(
  "jobs/toggleTask",
  async ({ jobId, taskId }, { rejectWithValue }) => {
    try {
      const response = await jobService.toggleTask(jobId, taskId);
      return { jobId, taskId, task: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle task",
      );
    }
  },
);

export const deleteTask = createAsyncThunk(
  "jobs/deleteTask",
  async ({ jobId, taskId }, { rejectWithValue }) => {
    try {
      await jobService.deleteTask(jobId, taskId);
      return { jobId, taskId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete task",
      );
    }
  },
);

// Attachment management
export const addAttachment = createAsyncThunk(
  "jobs/addAttachment",
  async ({ jobId, file, fileName, options = {} }, { rejectWithValue }) => {
    try {
      const response = await jobService.addAttachment(
        jobId,
        file,
        fileName,
        options,
      );
      return { jobId, attachment: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add attachment",
      );
    }
  },
);

export const deleteAttachment = createAsyncThunk(
  "jobs/deleteAttachment",
  async ({ jobId, attachmentId }, { rejectWithValue }) => {
    try {
      await jobService.deleteAttachment(jobId, attachmentId);
      return { jobId, attachmentId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete attachment",
      );
    }
  },
);

// Get job statistics
export const fetchJobStats = createAsyncThunk(
  "jobs/fetchJobStats",
  async (_, { rejectWithValue }) => {
    try {
      const stats = await jobService.getStatistics();
      return stats;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch job statistics",
      );
    }
  },
);

// ===== INITIAL STATE =====

const initialState = {
  jobs: [],
  currentJob: null,
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
    status: "",
    work_type: "",
    client_id: "",
    priority: "",
    date_from: "",
    date_to: "",
  },
  sort: {
    field: "created_at",
    direction: "desc",
  },
  stats: {
    total: 0,
    pending: 0,
    scheduled: 0,
    in_progress: 0,
    on_hold: 0,
    completed: 0,
    cancelled: 0,
    archived: 0,
    total_amount: 0,
    by_month: {},
  },
};

// ===== SLICE =====

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
      state.pagination.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
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
    setPerPage: (state, action) => {
      state.pagination.perPage = action.payload;
      state.pagination.currentPage = 1; // Reset to first page when changing items per page
    },
    // ⚠️ RENAMED this to avoid conflict with thunk
    setJobStatus: (state, action) => {
      const { id, status } = action.payload;
      const job = state.jobs.find((j) => j.id === id);
      if (job) {
        job.status = status;
      }
      if (state.currentJob?.id === id) {
        state.currentJob.status = status;
      }
    },
    // Local task updates for optimistic UI
    addTaskLocally: (state, action) => {
      const { jobId, task } = action.payload;
      if (state.currentJob?.id === jobId) {
        state.currentJob.tasks = [...(state.currentJob.tasks || []), task];
        state.currentJob.stats = {
          ...state.currentJob.stats,
          total_tasks: (state.currentJob.stats?.total_tasks || 0) + 1,
          pending_tasks: (state.currentJob.stats?.pending_tasks || 0) + 1,
        };
      }
    },
    toggleTaskLocally: (state, action) => {
      const { jobId, taskId, completed } = action.payload;
      if (state.currentJob?.id === jobId && state.currentJob.tasks) {
        const taskIndex = state.currentJob.tasks.findIndex(
          (t) => t.id === taskId,
        );
        if (taskIndex !== -1) {
          const wasCompleted = state.currentJob.tasks[taskIndex].completed;
          state.currentJob.tasks[taskIndex].completed = completed;

          if (state.currentJob.stats) {
            if (!wasCompleted && completed) {
              state.currentJob.stats.completed_tasks =
                (state.currentJob.stats.completed_tasks || 0) + 1;
              state.currentJob.stats.pending_tasks = Math.max(
                0,
                (state.currentJob.stats.pending_tasks || 0) - 1,
              );
            } else if (wasCompleted && !completed) {
              state.currentJob.stats.completed_tasks = Math.max(
                0,
                (state.currentJob.stats.completed_tasks || 0) - 1,
              );
              state.currentJob.stats.pending_tasks =
                (state.currentJob.stats.pending_tasks || 0) + 1;
            }
          }
        }
      }
    },
    deleteTaskLocally: (state, action) => {
      const { jobId, taskId } = action.payload;
      if (state.currentJob?.id === jobId && state.currentJob.tasks) {
        const task = state.currentJob.tasks.find((t) => t.id === taskId);
        if (task) {
          state.currentJob.tasks = state.currentJob.tasks.filter(
            (t) => t.id !== taskId,
          );
          state.currentJob.stats = {
            ...state.currentJob.stats,
            total_tasks: Math.max(
              0,
              (state.currentJob.stats?.total_tasks || 0) - 1,
            ),
            completed_tasks: task.completed
              ? Math.max(0, (state.currentJob.stats?.completed_tasks || 0) - 1)
              : state.currentJob.stats?.completed_tasks || 0,
            pending_tasks: !task.completed
              ? Math.max(0, (state.currentJob.stats?.pending_tasks || 0) - 1)
              : state.currentJob.stats?.pending_tasks || 0,
          };
        }
      }
    },
    addAttachmentLocally: (state, action) => {
      const { jobId, attachment, context } = action.payload;
      if (state.currentJob?.id === jobId) {
        if (!state.currentJob.attachments_by_context) {
          state.currentJob.attachments_by_context = {};
        }
        if (!state.currentJob.attachments_by_context[context]) {
          state.currentJob.attachments_by_context[context] = [];
        }
        state.currentJob.attachments_by_context[context].push(attachment);

        state.currentJob.stats = {
          ...state.currentJob.stats,
          total_attachments:
            (state.currentJob.stats?.total_attachments || 0) + 1,
          [`${context}_attachments`]:
            (state.currentJob.stats?.[`${context}_attachments`] || 0) + 1,
        };
      }
    },
    deleteAttachmentLocally: (state, action) => {
      const { jobId, attachmentId, context } = action.payload;
      if (
        state.currentJob?.id === jobId &&
        state.currentJob.attachments_by_context?.[context]
      ) {
        const attachment = state.currentJob.attachments_by_context[
          context
        ].find((a) => a.id === attachmentId);
        if (attachment) {
          state.currentJob.attachments_by_context[context] =
            state.currentJob.attachments_by_context[context].filter(
              (a) => a.id !== attachmentId,
            );

          state.currentJob.stats = {
            ...state.currentJob.stats,
            total_attachments: Math.max(
              0,
              (state.currentJob.stats?.total_attachments || 0) - 1,
            ),
            [`${context}_attachments`]: Math.max(
              0,
              (state.currentJob.stats?.[`${context}_attachments`] || 0) - 1,
            ),
          };
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.data || [];

        // Update pagination while preserving the current perPage if needed
        if (action.payload.pagination) {
          state.pagination = {
            total: action.payload.pagination.total || 0,
            perPage:
              action.payload.pagination.perPage || state.pagination.perPage,
            currentPage: action.payload.pagination.currentPage || 1,
            totalPages: action.payload.pagination.totalPages || 1,
            from: action.payload.pagination.from || null,
            to: action.payload.pagination.to || null,
          };
        }
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Job
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Job
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.unshift(action.payload);
        state.pagination.total += 1;
        state.stats.total += 1;
        state.stats.pending += 1;
        state.success = "Job created successfully";
        state.currentJob = action.payload;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Job
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.jobs.findIndex((j) => j.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        if (state.currentJob?.id === action.payload.id) {
          state.currentJob = action.payload;
        }
        //state.success = "Job updated successfully";
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Job
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter((j) => j.id !== action.payload);
        state.pagination.total -= 1;
        state.stats.total -= 1;

        if (state.currentJob?.id === action.payload) {
          state.currentJob = null;
        }
        state.success = "Job deleted successfully";
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ⚠️ This handles the THUNK (updateJobStatus)
      .addCase(updateJobStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;

        // Update in jobs list
        const jobIndex = state.jobs.findIndex((j) => j.id === id);
        if (jobIndex !== -1) {
          const oldStatus = state.jobs[jobIndex].status;
          state.jobs[jobIndex].status = status;

          // Update stats if we have them
          if (state.stats && oldStatus !== status) {
            state.stats[oldStatus] = Math.max(
              0,
              (state.stats[oldStatus] || 0) - 1,
            );
            state.stats[status] = (state.stats[status] || 0) + 1;
          }
        }

        // Update current job if it's the one
        if (state.currentJob?.id === id) {
          state.currentJob.status = status;
        }

        state.success = "Job status updated successfully";
      })
      .addCase(updateJobStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Add Task
      .addCase(addTask.fulfilled, (state, action) => {
        const { jobId, task } = action.payload;
        if (state.currentJob?.id === jobId) {
          state.currentJob.tasks = [...(state.currentJob.tasks || []), task];
          state.currentJob.stats = {
            ...state.currentJob.stats,
            total_tasks: (state.currentJob.stats?.total_tasks || 0) + 1,
            pending_tasks: (state.currentJob.stats?.pending_tasks || 0) + 1,
          };
        }
        state.success = "Task added successfully";
      })
      .addCase(addTask.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Toggle Task
      .addCase(toggleTask.fulfilled, (state, action) => {
        const { jobId, taskId, task } = action.payload;
        if (state.currentJob?.id === jobId && state.currentJob.tasks) {
          const taskIndex = state.currentJob.tasks.findIndex(
            (t) => t.id === taskId,
          );
          if (taskIndex !== -1) {
            const wasCompleted = state.currentJob.tasks[taskIndex].completed;
            state.currentJob.tasks[taskIndex] = task;

            if (state.currentJob.stats) {
              if (!wasCompleted && task.completed) {
                state.currentJob.stats.completed_tasks =
                  (state.currentJob.stats.completed_tasks || 0) + 1;
                state.currentJob.stats.pending_tasks = Math.max(
                  0,
                  (state.currentJob.stats.pending_tasks || 0) - 1,
                );
              } else if (wasCompleted && !task.completed) {
                state.currentJob.stats.completed_tasks = Math.max(
                  0,
                  (state.currentJob.stats.completed_tasks || 0) - 1,
                );
                state.currentJob.stats.pending_tasks =
                  (state.currentJob.stats.pending_tasks || 0) + 1;
              }
            }
          }
        }
      })

      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action) => {
        const { jobId, taskId } = action.payload;
        if (state.currentJob?.id === jobId && state.currentJob.tasks) {
          const task = state.currentJob.tasks.find((t) => t.id === taskId);
          if (task) {
            state.currentJob.tasks = state.currentJob.tasks.filter(
              (t) => t.id !== taskId,
            );
            state.currentJob.stats = {
              ...state.currentJob.stats,
              total_tasks: Math.max(
                0,
                (state.currentJob.stats?.total_tasks || 0) - 1,
              ),
              completed_tasks: task.completed
                ? Math.max(
                    0,
                    (state.currentJob.stats?.completed_tasks || 0) - 1,
                  )
                : state.currentJob.stats?.completed_tasks || 0,
              pending_tasks: !task.completed
                ? Math.max(0, (state.currentJob.stats?.pending_tasks || 0) - 1)
                : state.currentJob.stats?.pending_tasks || 0,
            };
          }
        }
        state.success = "Task deleted successfully";
      })

      // Add Attachment
      .addCase(addAttachment.fulfilled, (state, action) => {
        const { jobId, attachment } = action.payload;
        if (state.currentJob?.id === jobId) {
          const context = attachment.context || "general";

          if (!state.currentJob.attachments_by_context) {
            state.currentJob.attachments_by_context = {};
          }
          if (!state.currentJob.attachments_by_context[context]) {
            state.currentJob.attachments_by_context[context] = [];
          }
          state.currentJob.attachments_by_context[context].push(attachment);

          state.currentJob.stats = {
            ...state.currentJob.stats,
            total_attachments:
              (state.currentJob.stats?.total_attachments || 0) + 1,
            [`${context}_attachments`]:
              (state.currentJob.stats?.[`${context}_attachments`] || 0) + 1,
          };
        }
        state.success = "Attachment added successfully";
      })

      // Delete Attachment
      .addCase(deleteAttachment.fulfilled, (state, action) => {
        const { jobId, attachmentId } = action.payload;
        if (
          state.currentJob?.id === jobId &&
          state.currentJob.attachments_by_context
        ) {
          let attachmentContext = null;
          let attachment = null;

          Object.keys(state.currentJob.attachments_by_context).forEach(
            (context) => {
              const found = state.currentJob.attachments_by_context[
                context
              ].find((a) => a.id === attachmentId);
              if (found) {
                attachmentContext = context;
                attachment = found;
              }
            },
          );

          if (attachmentContext && attachment) {
            state.currentJob.attachments_by_context[attachmentContext] =
              state.currentJob.attachments_by_context[attachmentContext].filter(
                (a) => a.id !== attachmentId,
              );

            state.currentJob.stats = {
              ...state.currentJob.stats,
              total_attachments: Math.max(
                0,
                (state.currentJob.stats?.total_attachments || 0) - 1,
              ),
              [`${attachmentContext}_attachments`]: Math.max(
                0,
                (state.currentJob.stats?.[`${attachmentContext}_attachments`] ||
                  0) - 1,
              ),
            };
          }
        }
        state.success = "Attachment deleted successfully";
      })

      // Fetch Job Stats
      .addCase(fetchJobStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchJobStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  setPerPage,
  setSort,
  setCurrentPage,
  clearCurrentJob,
  clearError,
  clearSuccess,
  resetFilters,
  setJobStatus,
  addTaskLocally,
  toggleTaskLocally,
  deleteTaskLocally,
  addAttachmentLocally,
  deleteAttachmentLocally,
} = jobSlice.actions;

export default jobSlice.reducer;
