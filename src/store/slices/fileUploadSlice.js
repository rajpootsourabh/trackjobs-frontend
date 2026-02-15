import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fileUploadService } from "../../services/api/fileUploadService";

// Async thunks
export const uploadTempFile = createAsyncThunk(
  "fileUpload/uploadTempFile",
  async (file, { rejectWithValue }) => {
    try {
      // Validate file before upload
      const validation = fileUploadService.validateFile(file, {
        maxSize: 20 * 1024 * 1024, // 20MB
        allowedTypes: [
          'image/jpeg', 'image/png', 'image/gif', 
          'application/pdf', 'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
      });

      if (!validation.isValid) {
        return rejectWithValue({
          success: false,
          message: validation.errors.join(', '),
          data: null
        });
      }

      const response = await fileUploadService.uploadTempFile(file);
      return response;
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.response?.data?.message || error.message || "Failed to upload file",
        data: error.response?.data?.data
      });
    }
  }
);

export const uploadFile = createAsyncThunk(
  "fileUpload/uploadFile",
  async ({ file, path, disk = 'local' }, { rejectWithValue }) => {
    try {
      const validation = fileUploadService.validateFile(file);
      
      if (!validation.isValid) {
        return rejectWithValue({
          success: false,
          message: validation.errors.join(', '),
          data: null
        });
      }

      const response = await fileUploadService.uploadFile(file, path, disk);
      return response;
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.response?.data?.message || error.message || "Failed to upload file",
        data: error.response?.data?.data
      });
    }
  }
);

export const deleteTempFile = createAsyncThunk(
  "fileUpload/deleteTempFile",
  async (tempId, { rejectWithValue }) => {
    try {
      const response = await fileUploadService.deleteTempFile(tempId);
      return response;
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.response?.data?.message || error.message || "Failed to delete file",
        data: error.response?.data?.data
      });
    }
  }
);

export const uploadMultipleFiles = createAsyncThunk(
  "fileUpload/uploadMultipleFiles",
  async ({ files, path = 'temp', disk = 'local' }, { rejectWithValue }) => {
    try {
      // Validate all files
      const invalidFiles = [];
      files.forEach((file, index) => {
        const validation = fileUploadService.validateFile(file);
        if (!validation.isValid) {
          invalidFiles.push({
            index,
            name: file.name,
            errors: validation.errors
          });
        }
      });

      if (invalidFiles.length > 0) {
        return rejectWithValue({
          success: false,
          message: `Invalid files: ${invalidFiles.map(f => f.name).join(', ')}`,
          data: { invalidFiles }
        });
      }

      const response = await fileUploadService.uploadMultipleFiles(files, path, disk);
      return response;
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.response?.data?.message || error.message || "Failed to upload files",
        data: error.response?.data?.data
      });
    }
  }
);

// Initial state
const initialState = {
  uploads: {}, // Store uploads by key
  currentUpload: null,
  loading: false,
  uploading: false, // For single file uploads
  bulkUploading: false, // For multiple file uploads
  error: null,
  success: false,
  progress: 0, // Upload progress percentage
  uploadedFiles: [], // List of successfully uploaded files
  failedFiles: [], // List of failed uploads
};

// Slice
const fileUploadSlice = createSlice({
  name: "fileUpload",
  initialState,
  reducers: {
    clearUploadState: (state) => {
      return initialState;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
    setUploadProgress: (state, action) => {
      state.progress = action.payload;
    },
    removeUploadedFile: (state, action) => {
      const tempId = action.payload;
      state.uploadedFiles = state.uploadedFiles.filter(file => file.temp_id !== tempId);
      
      // Also remove from uploads object
      delete state.uploads[tempId];
    },
    clearUploadedFiles: (state) => {
      state.uploadedFiles = [];
      state.uploads = {};
    },
    setCurrentUpload: (state, action) => {
      state.currentUpload = action.payload;
    },
    // Add a file to the uploads cache
    addToUploadsCache: (state, action) => {
      const { key, data } = action.payload;
      state.uploads[key] = {
        ...data,
        timestamp: Date.now()
      };
    },
    // Remove from uploads cache
    removeFromUploadsCache: (state, action) => {
      const key = action.payload;
      delete state.uploads[key];
    }
  },
  extraReducers: (builder) => {
    // Upload temp file
    builder
      .addCase(uploadTempFile.pending, (state) => {
        state.loading = true;
        state.uploading = true;
        state.error = null;
        state.success = false;
        state.progress = 0;
      })
      .addCase(uploadTempFile.fulfilled, (state, action) => {
        state.loading = false;
        state.uploading = false;
        state.progress = 100;
        
        const result = action.payload;
        
        if (result.success && result.data) {
          state.success = true;
          state.currentUpload = result.data;
          
          // Add to uploaded files list
          state.uploadedFiles.push(result.data);
          
          // Add to uploads cache
          state.uploads[result.data.temp_id] = {
            ...result.data,
            timestamp: Date.now()
          };
        } else {
          state.error = {
            message: result?.message || "Failed to upload file",
            data: result?.data,
          };
        }
      })
      .addCase(uploadTempFile.rejected, (state, action) => {
        state.loading = false;
        state.uploading = false;
        state.progress = 0;
        
        const errorPayload = action.payload || {
          success: false,
          message: "Failed to upload file",
        };
        
        state.error = {
          message: errorPayload.message,
          data: errorPayload.data,
        };
        state.success = false;
        
        // Add to failed files if we have file info
        if (action.meta.arg && typeof action.meta.arg === 'object') {
          state.failedFiles.push({
            file: action.meta.arg,
            error: errorPayload.message
          });
        }
      });

    // Upload file (permanent)
    builder
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.uploading = true;
        state.error = null;
        state.success = false;
        state.progress = 0;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.uploading = false;
        state.progress = 100;
        
        const result = action.payload;
        
        if (result.success && result.data) {
          state.success = true;
          state.currentUpload = result.data;
          state.uploadedFiles.push(result.data);
        } else {
          state.error = {
            message: result?.message || "Failed to upload file",
            data: result?.data,
          };
        }
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.uploading = false;
        state.progress = 0;
        
        const errorPayload = action.payload || {
          success: false,
          message: "Failed to upload file",
        };
        
        state.error = {
          message: errorPayload.message,
          data: errorPayload.data,
        };
        state.success = false;
      });

    // Delete temp file
    builder
      .addCase(deleteTempFile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteTempFile.fulfilled, (state, action) => {
        state.loading = false;
        const result = action.payload;
        
        if (result.success) {
          state.success = true;
          
          // Remove from uploaded files
          const tempId = action.meta.arg;
          state.uploadedFiles = state.uploadedFiles.filter(file => file.temp_id !== tempId);
          
          // Remove from uploads cache
          delete state.uploads[tempId];
        } else {
          state.error = {
            message: result?.message || "Failed to delete file",
            data: result?.data,
          };
        }
      })
      .addCase(deleteTempFile.rejected, (state, action) => {
        state.loading = false;
        
        const errorPayload = action.payload || {
          success: false,
          message: "Failed to delete file",
        };
        
        state.error = {
          message: errorPayload.message,
          data: errorPayload.data,
        };
        state.success = false;
      });

    // Upload multiple files
    builder
      .addCase(uploadMultipleFiles.pending, (state) => {
        state.loading = true;
        state.bulkUploading = true;
        state.error = null;
        state.success = false;
        state.progress = 0;
        state.failedFiles = [];
      })
      .addCase(uploadMultipleFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.bulkUploading = false;
        state.progress = 100;
        
        const result = action.payload;
        
        if (result.success && result.data) {
          state.success = true;
          
          // Add all uploaded files to the list
          if (Array.isArray(result.data)) {
            state.uploadedFiles.push(...result.data);
            
            // Add to uploads cache
            result.data.forEach(fileData => {
              state.uploads[fileData.temp_id] = {
                ...fileData,
                timestamp: Date.now()
              };
            });
          }
        } else {
          state.error = {
            message: result?.message || "Failed to upload files",
            data: result?.data,
          };
        }
      })
      .addCase(uploadMultipleFiles.rejected, (state, action) => {
        state.loading = false;
        state.bulkUploading = false;
        state.progress = 0;
        
        const errorPayload = action.payload || {
          success: false,
          message: "Failed to upload files",
        };
        
        state.error = {
          message: errorPayload.message,
          data: errorPayload.data,
        };
        state.success = false;
        
        // Store failed files info
        if (errorPayload.data?.invalidFiles) {
          state.failedFiles = errorPayload.data.invalidFiles;
        }
      });
  },
});

export const {
  clearUploadState,
  clearError,
  resetSuccess,
  setUploadProgress,
  removeUploadedFile,
  clearUploadedFiles,
  setCurrentUpload,
  addToUploadsCache,
  removeFromUploadsCache,
} = fileUploadSlice.actions;

export default fileUploadSlice.reducer;