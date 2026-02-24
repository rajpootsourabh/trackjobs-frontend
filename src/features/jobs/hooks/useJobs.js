// features/jobs/hooks/useJobs.js
import { useState, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobs,
  fetchJobById,
  createJob,
  updateJob,
  deleteJob,
  updateJobStatus,
  addTask,
  toggleTask,
  deleteTask,
  addAttachment,
  deleteAttachment,
  fetchJobStats,
  setFilters,
  setSort,
  setCurrentPage,
  setPerPage,
  clearCurrentJob,
  clearError,
  clearSuccess,
  resetFilters,
  addTaskLocally,
  toggleTaskLocally,
  deleteTaskLocally,
  addAttachmentLocally,
  deleteAttachmentLocally,
  setJobStatus,
} from "../../../store/slices/features/jobSlice";
import { useToast } from "../../../components/common/ToastProvider";

export const useJobs = ({ autoFetch = true } = {}) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const {
    jobs,
    currentJob,
    pagination,
    loading,
    error,
    success,
    filters,
    sort,
    stats,
  } = useSelector((state) => state.jobs);

  const [localError, setLocalError] = useState(null);

  // Use refs to track if this is the first mount
  const isFirstMount = useRef(true);
  const fetchInProgressRef = useRef(false);

  /* ---------------------------------------------------------
     FETCH JOBS FUNCTION
  --------------------------------------------------------- */
  const fetchJobsData = useCallback(async () => {
    if (fetchInProgressRef.current) return;

    fetchInProgressRef.current = true;

    try {
      await dispatch(
        fetchJobs({
          page: pagination.currentPage,
          perPage: pagination.perPage,
          filters,
          sort,
        })
      ).unwrap();
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      fetchInProgressRef.current = false;
    }
  }, [dispatch, pagination.currentPage, pagination.perPage, filters, sort]);

  /* ---------------------------------------------------------
     AUTO FETCH JOBS
  --------------------------------------------------------- */
  useEffect(() => {
    if (!autoFetch) return;

    if (isFirstMount.current) {
      isFirstMount.current = false;
      fetchJobsData();
      return;
    }

    fetchJobsData();
  }, [
    fetchJobsData,
    pagination.currentPage,
    pagination.perPage,
    filters,
    sort,
    autoFetch,
  ]);

  /* ---------------------------------------------------------
     FILTER / SEARCH / SORT HANDLERS
  --------------------------------------------------------- */
  const handleSearch = useCallback(
    (searchTerm) => {
      dispatch(setFilters({ search: searchTerm }));
    },
    [dispatch]
  );

  const handleFilterChange = useCallback(
    (newFilters) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const handleSort = useCallback(
    (field, direction) => {
      dispatch(setSort({ field, direction }));
    },
    [dispatch]
  );

  const handlePageChange = useCallback(
    (event, newPage) => {
      dispatch(setCurrentPage(newPage + 1));
    },
    [dispatch]
  );

  const refresh = useCallback(() => {
    fetchJobsData();
  }, [fetchJobsData]);

  /* ---------------------------------------------------------
     CRUD OPERATIONS
  --------------------------------------------------------- */
  const getJob = useCallback(
    async (id) => {
      try {
        return await dispatch(fetchJobById(id)).unwrap();
      } catch (err) {
        const msg = err?.message || err?.data?.message || "Failed to fetch job";
        setLocalError(msg);
        showToast(msg, "error");
        throw new Error(msg);
      }
    },
    [dispatch, showToast]
  );

  const createJobHandler = useCallback(
    async (data) => {
      try {
        const result = await dispatch(createJob(data)).unwrap();
        showToast("Job created successfully", "success");
        setTimeout(() => refresh(), 500);
        return result;
      } catch (err) {
        const msg = err?.message || err?.data?.message || "Failed to create job";
        setLocalError(msg);
        showToast(msg, "error");
        throw err;
      }
    },
    [dispatch, refresh, showToast]
  );

  const updateJobHandler = useCallback(
    async (id, data) => {
      try {
        const result = await dispatch(updateJob({ id, data })).unwrap();
        showToast("Job updated successfully", "success");
        return result;
      } catch (err) {
        const msg = err?.message || err?.data?.message || "Failed to update job";
        setLocalError(msg);
        showToast(msg, "error");
        throw err;
      }
    },
    [dispatch, showToast]
  );

  const deleteJobHandler = useCallback(
    async (id) => {
      try {
        await dispatch(deleteJob(id)).unwrap();
        showToast("Job deleted successfully", "success");
        setTimeout(() => refresh(), 500);
      } catch (err) {
        const msg = err?.message || err?.data?.message || "Failed to delete job";
        setLocalError(msg);
        showToast(msg, "error");
        throw err;
      }
    },
    [dispatch, refresh, showToast]
  );

  const changeJobStatus = useCallback(
    async (id, status) => {
      try {
        // Optimistic update
        dispatch(setJobStatus({ id, status }));
        
        const result = await dispatch(updateJobStatus({ id, status })).unwrap();
        showToast(`Job status updated to ${status.replace("_", " ")}`, "success");
        return result;
      } catch (err) {
        // Revert optimistic update on error
        if (currentJob?.id === id) {
          dispatch(fetchJobById(id));
        }
        const msg = err?.message || err?.data?.message || "Failed to update status";
        setLocalError(msg);
        showToast(msg, "error");
        throw err;
      }
    },
    [dispatch, showToast, currentJob]
  );

  /* ---------------------------------------------------------
     TASK OPERATIONS WITH OPTIMISTIC UPDATES
  --------------------------------------------------------- */
  const addTaskHandler = useCallback(
    async (jobId, taskData) => {
      // Create a temporary ID for optimistic update
      const tempId = `temp-${Date.now()}`;
      const tempTask = {
        id: tempId,
        ...taskData,
        completed: false,
        created_at: new Date().toISOString(),
      };

      try {
        // Optimistic update
        dispatch(addTaskLocally({ jobId, task: tempTask }));
        
        const result = await dispatch(addTask({ jobId, taskData })).unwrap();
        showToast("Task added successfully", "success");
        return result;
      } catch (err) {
        // Revert optimistic update on error
        if (currentJob?.id === jobId) {
          dispatch(fetchJobById(jobId));
        }
        const msg = err?.message || err?.data?.message || "Failed to add task";
        setLocalError(msg);
        showToast(msg, "error");
        throw err;
      }
    },
    [dispatch, showToast, currentJob]
  );

  const toggleTaskHandler = useCallback(
    async (jobId, taskId, currentCompleted) => {
      try {
        // Optimistic update
        dispatch(toggleTaskLocally({ 
          jobId, 
          taskId, 
          completed: !currentCompleted 
        }));
        
        const result = await dispatch(toggleTask({ jobId, taskId })).unwrap();
        return result;
      } catch (err) {
        // Revert optimistic update on error
        if (currentJob?.id === jobId) {
          dispatch(fetchJobById(jobId));
        }
        const msg = err?.message || err?.data?.message || "Failed to update task";
        setLocalError(msg);
        showToast(msg, "error");
        throw err;
      }
    },
    [dispatch, showToast, currentJob]
  );

  const deleteTaskHandler = useCallback(
    async (jobId, taskId) => {
      try {
        // Optimistic update
        dispatch(deleteTaskLocally({ jobId, taskId }));
        
        await dispatch(deleteTask({ jobId, taskId })).unwrap();
        showToast("Task deleted successfully", "success");
      } catch (err) {
        // Revert optimistic update on error
        if (currentJob?.id === jobId) {
          dispatch(fetchJobById(jobId));
        }
        const msg = err?.message || err?.data?.message || "Failed to delete task";
        setLocalError(msg);
        showToast(msg, "error");
        throw err;
      }
    },
    [dispatch, showToast, currentJob]
  );

  /* ---------------------------------------------------------
     ATTACHMENT OPERATIONS WITH OPTIMISTIC UPDATES
  --------------------------------------------------------- */
  const addAttachmentHandler = useCallback(
    async (jobId, file, fileName, options = {}) => {
      // Create a temporary attachment object for optimistic update
      const tempId = `temp-${Date.now()}`;
      const tempAttachment = {
        id: tempId,
        file_name: fileName || file.name,
        file_type: file.type?.startsWith('image/') ? 'image' : 
                  file.type === 'application/pdf' ? 'pdf' : 'document',
        extension: file.name?.split('.').pop()?.toUpperCase() || 'FILE',
        uploaded_at: new Date().toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        }),
        formatted_size: formatFileSize(file.size),
        url: URL.createObjectURL(file), // Temporary URL
        context: options.context || 'general',
      };

      try {
        // Optimistic update
        dispatch(addAttachmentLocally({ 
          jobId, 
          attachment: tempAttachment,
          context: options.context || 'general'
        }));
        
        const result = await dispatch(
          addAttachment({
            jobId,
            file,
            fileName: fileName || file.name,
            options,
          })
        ).unwrap();
        
        showToast("File uploaded successfully", "success");
        return result;
      } catch (err) {
        // Revert optimistic update on error
        if (currentJob?.id === jobId) {
          dispatch(fetchJobById(jobId));
        }
        const msg = err?.message || err?.data?.message || "Failed to upload file";
        setLocalError(msg);
        showToast(msg, "error");
        throw err;
      }
    },
    [dispatch, showToast, currentJob]
  );

  const deleteAttachmentHandler = useCallback(
    async (jobId, attachmentId, context) => {
      try {
        // Optimistic update
        dispatch(deleteAttachmentLocally({ jobId, attachmentId, context }));
        
        await dispatch(deleteAttachment({ jobId, attachmentId })).unwrap();
        showToast("Attachment deleted successfully", "success");
      } catch (err) {
        // Revert optimistic update on error
        if (currentJob?.id === jobId) {
          dispatch(fetchJobById(jobId));
        }
        const msg = err?.message || err?.data?.message || "Failed to delete attachment";
        setLocalError(msg);
        showToast(msg, "error");
        throw err;
      }
    },
    [dispatch, showToast, currentJob]
  );

  const getJobStatsHandler = useCallback(async () => {
    try {
      return await dispatch(fetchJobStats()).unwrap();
    } catch (err) {
      const msg = err?.message || err?.data?.message || "Failed to fetch statistics";
      setLocalError(msg);
      showToast(msg, "error");
      throw err;
    }
  }, [dispatch, showToast]);

  /* ---------------------------------------------------------
     FILTER UTILITIES
  --------------------------------------------------------- */
  const updateFilters = useCallback(
    (newFilters) => dispatch(setFilters(newFilters)),
    [dispatch]
  );

  const updateSort = useCallback(
    (field, direction) => dispatch(setSort({ field, direction })),
    [dispatch]
  );

  const setPage = useCallback(
    (page) => dispatch(setCurrentPage(page)),
    [dispatch]
  );

  const handleSetPerPage = useCallback(
    (perPage) => {
      dispatch(setPerPage(perPage));
    },
    [dispatch]
  );

  const resetAllFilters = useCallback(() => {
    dispatch(resetFilters());
    dispatch(setCurrentPage(1));
  }, [dispatch]);

  /* ---------------------------------------------------------
     CLEAR HELPERS
  --------------------------------------------------------- */
  const clearCurrent = useCallback(
    () => dispatch(clearCurrentJob()),
    [dispatch]
  );

  const clearJobError = useCallback(() => {
    setLocalError(null);
    dispatch(clearError());
  }, [dispatch]);

  const clearJobSuccess = useCallback(
    () => dispatch(clearSuccess()),
    [dispatch]
  );

  /* ---------------------------------------------------------
     DERIVED DATA
  --------------------------------------------------------- */
  const getJobsByStatus = useCallback(
    (status) => jobs.filter((j) => j.status === status),
    [jobs]
  );

  const getJobsByWorkType = useCallback(
    (workType) => jobs.filter((j) => j.work_type === workType),
    [jobs]
  );

  const getTotalJobsValue = useCallback(
    (status = null) => {
      const filtered = status ? jobs.filter((j) => j.status === status) : jobs;
      return filtered.reduce((sum, j) => sum + (j.total_amount || 0), 0);
    },
    [jobs]
  );

  /* ---------------------------------------------------------
     HELPER FUNCTIONS
  --------------------------------------------------------- */
  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  /* ---------------------------------------------------------
     RETURN API
  --------------------------------------------------------- */
  return {
    // State
    jobs,
    currentJob,
    loading,
    error: error || localError,
    success,
    stats,
    pagination: {
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      totalItems: pagination.total,
      perPage: pagination.perPage,
      from: pagination.from,
      to: pagination.to,
    },
    filters,
    sort,
    
    // Job operations
    loadJobs: refresh,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    handleSort,
    refresh,
    getJob,
    createJob: createJobHandler,
    updateJob: updateJobHandler,
    deleteJob: deleteJobHandler,
    changeJobStatus,
    
    // Task operations
    addTask: addTaskHandler,
    toggleTask: toggleTaskHandler,
    deleteTask: deleteTaskHandler,
    
    // Attachment operations
    addAttachment: addAttachmentHandler,
    deleteAttachment: deleteAttachmentHandler,
    
    // Stats
    getJobStats: getJobStatsHandler,
    
    // Filter utilities
    updateFilters,
    updateSort,
    setPage,
    setPerPage: handleSetPerPage,
    resetFilters: resetAllFilters,
    
    // Derived data
    getJobsByStatus,
    getJobsByWorkType,
    getTotalJobsValue,
    
    // Clear functions
    clearCurrent,
    clearError: clearJobError,
    clearSuccess: clearJobSuccess,
    
    // Helpers
    formatFileSize,
  };
};