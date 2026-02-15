import httpClient from './httpClient';

export const fileUploadService = {
  // Upload temporary file
  uploadTempFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await httpClient.post('/api/v1/uploads/temp', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Handle the nested response structure
    if (response.data && response.data.data) {
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data
      };
    }
    
    return response.data;
  },

  // Upload permanent file to specific path
  uploadFile: async (file, path, disk = 'local') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    formData.append('disk', disk);

    const response = await httpClient.post('/api/v1/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data && response.data.data) {
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data
      };
    }
    
    return response.data;
  },

  // Delete temporary file
  deleteTempFile: async (tempId) => {
    const response = await httpClient.delete(`/api/v1/uploads/temp/${tempId}`);
    
    if (response.data && response.data.success !== undefined) {
      return response.data;
    }
    
    return {
      success: response.status >= 200 && response.status < 300,
      message: response.data?.message || "File deleted successfully",
      data: response.data
    };
  },

  // Get signed URL for file
  getSignedUrl: async (path, disk = 'local', expiresIn = 3600) => {
    const response = await httpClient.get('/api/v1/files/signed', {
      params: {
        path,
        disk,
        expires_in: expiresIn
      }
    });
    
    if (response.data && response.data.data) {
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data
      };
    }
    
    return response.data;
  },

  // Bulk upload multiple files
  uploadMultipleFiles: async (files, path = 'temp', disk = 'local') => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    formData.append('path', path);
    formData.append('disk', disk);

    const response = await httpClient.post('/api/v1/uploads/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data && response.data.data) {
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data
      };
    }
    
    return response.data;
  },

  // Validate file before upload
  validateFile: (file, options = {}) => {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx']
    } = options;

    const errors = [];

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
    }

    // Check MIME type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed`);
    }

    // Check file extension
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    if (!hasValidExtension) {
      errors.push(`File extension not allowed. Allowed: ${allowedExtensions.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

export default fileUploadService;