import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';
import { 
  uploadTempFile,
  uploadFile,
  deleteTempFile,
  uploadMultipleFiles,
  clearUploadState,
  clearError,
  resetSuccess,
  setUploadProgress,
  removeUploadedFile,
  clearUploadedFiles,
  setCurrentUpload,
  addToUploadsCache,
  removeFromUploadsCache,
} from '../store/slices/fileUploadSlice';

export const useFileUpload = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const uploads = useSelector((state) => state.fileUpload.uploads);
  const currentUpload = useSelector((state) => state.fileUpload.currentUpload);
  const loading = useSelector((state) => state.fileUpload.loading);
  const uploading = useSelector((state) => state.fileUpload.uploading);
  const bulkUploading = useSelector((state) => state.fileUpload.bulkUploading);
  const error = useSelector((state) => state.fileUpload.error);
  const success = useSelector((state) => state.fileUpload.success);
  const progress = useSelector((state) => state.fileUpload.progress);
  const uploadedFiles = useSelector((state) => state.fileUpload.uploadedFiles);
  const failedFiles = useSelector((state) => state.fileUpload.failedFiles);

  // Actions
  const uploadTemp = useCallback(async (file) => {
    return dispatch(uploadTempFile(file));
  }, [dispatch]);

  const upload = useCallback(async (file, path, disk = 'local') => {
    return dispatch(uploadFile({ file, path, disk }));
  }, [dispatch]);

  const deleteTemp = useCallback(async (tempId) => {
    return dispatch(deleteTempFile(tempId));
  }, [dispatch]);

  const uploadMultiple = useCallback(async (files, path = 'temp', disk = 'local') => {
    return dispatch(uploadMultipleFiles({ files, path, disk }));
  }, [dispatch]);

  const clearState = useCallback(() => {
    dispatch(clearUploadState());
  }, [dispatch]);

  const clearErrors = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const resetSuccessFlag = useCallback(() => {
    dispatch(resetSuccess());
  }, [dispatch]);

  const updateProgress = useCallback((progressValue) => {
    dispatch(setUploadProgress(progressValue));
  }, [dispatch]);

  const removeFile = useCallback((tempId) => {
    dispatch(removeUploadedFile(tempId));
  }, [dispatch]);

  const clearFiles = useCallback(() => {
    dispatch(clearUploadedFiles());
  }, [dispatch]);

  const selectUpload = useCallback((upload) => {
    dispatch(setCurrentUpload(upload));
  }, [dispatch]);

  const addToCache = useCallback((key, data) => {
    dispatch(addToUploadsCache({ key, data }));
  }, [dispatch]);

  const removeFromCache = useCallback((key) => {
    dispatch(removeFromUploadsCache(key));
  }, [dispatch]);

  // Helper functions
  const getUploadByTempId = useCallback((tempId) => {
    return uploads[tempId] || null;
  }, [uploads]);

  const getUploadByFileName = useCallback((fileName) => {
    return uploadedFiles.find(file => 
      file.original_name === fileName || 
      file.temp_path?.includes(fileName)
    ) || null;
  }, [uploadedFiles]);

  const hasUploadedFile = useCallback((tempId) => {
    return Boolean(uploads[tempId]);
  }, [uploads]);

  const getSignedUrl = useCallback((tempId) => {
    const upload = uploads[tempId];
    return upload?.signed_url || null;
  }, [uploads]);

  // File validation helper
  const validateFile = useCallback((file, options = {}) => {
    const {
      maxSize = 10 * 1024 * 1024,
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
    } = options;

    const errors = [];

    if (file.size > maxSize) {
      errors.push(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed`);
    }

    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    if (!hasValidExtension) {
      errors.push(`File extension not allowed. Allowed: ${allowedExtensions.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  // Format file size
  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Get file extension
  const getFileExtension = useCallback((fileName) => {
    return fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2);
  }, []);

  // Check if file is an image
  const isImageFile = useCallback((file) => {
    return file.type.startsWith('image/');
  }, []);

  // Check if file is a PDF
  const isPDFFile = useCallback((file) => {
    return file.type === 'application/pdf';
  }, []);

  // Create file preview URL
  const createFilePreview = useCallback((file) => {
    if (isImageFile(file)) {
      return URL.createObjectURL(file);
    }
    return null;
  }, [isImageFile]);

  // Revoke file preview URL
  const revokeFilePreview = useCallback((url) => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }, []);

  // Clean up old uploads from cache (older than 24 hours)
  const cleanupOldUploads = useCallback(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    Object.entries(uploads).forEach(([key, upload]) => {
      if (now - upload.timestamp > oneDay) {
        removeFromCache(key);
      }
    });
  }, [uploads, removeFromCache]);

  return {
    // State
    uploads,
    currentUpload,
    loading,
    uploading,
    bulkUploading,
    error,
    success,
    progress,
    uploadedFiles,
    failedFiles,

    // Actions
    uploadTemp,
    upload,
    deleteTemp,
    uploadMultiple,
    clearState,
    clearErrors,
    resetSuccessFlag,
    updateProgress,
    removeFile,
    clearFiles,
    selectUpload,
    addToCache,
    removeFromCache,

    // Helpers
    getUploadByTempId,
    getUploadByFileName,
    hasUploadedFile,
    getSignedUrl,
    validateFile,
    formatFileSize,
    getFileExtension,
    isImageFile,
    isPDFFile,
    createFilePreview,
    revokeFilePreview,
    cleanupOldUploads,

    // Computed values
    hasUploads: Object.keys(uploads).length > 0,
    totalUploadedFiles: uploadedFiles.length,
    totalFailedFiles: failedFiles.length,
    uploadProgressPercentage: progress,
    isUploading: uploading || bulkUploading,
    
    // Convenience methods for common scenarios
    uploadProfileImage: useCallback(async (file) => {
      const validation = validateFile(file, {
        maxSize: 5 * 1024 * 1024, // 5MB for profile images
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif']
      });
      
      if (!validation.isValid) {
        return Promise.reject(new Error(validation.errors.join(', ')));
      }
      
      return uploadTemp(file);
    }, [uploadTemp, validateFile]),

    uploadDocument: useCallback(async (file) => {
      const validation = validateFile(file, {
        maxSize: 20 * 1024 * 1024, // 20MB for documents
        allowedTypes: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        allowedExtensions: ['.pdf', '.doc', '.docx']
      });
      
      if (!validation.isValid) {
        return Promise.reject(new Error(validation.errors.join(', ')));
      }
      
      return uploadTemp(file);
    }, [uploadTemp, validateFile]),

    uploadResume: useCallback(async (file) => {
      const validation = validateFile(file, {
        maxSize: 10 * 1024 * 1024, // 10MB for resumes
        allowedTypes: ['application/pdf'],
        allowedExtensions: ['.pdf']
      });
      
      if (!validation.isValid) {
        return Promise.reject(new Error(validation.errors.join(', ')));
      }
      
      return uploadTemp(file);
    }, [uploadTemp, validateFile]),
  };
};

export default useFileUpload;