// components/common/FileUploader/FileUploader.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { X, Loader } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { uploadTempFile } from '../../store/slices/fileUploadSlice';


const FileUploader = ({
  // Formik integration
  formik,
  
  // Field names (configurable)
  tempIdField = 'logo_temp_id',
  removeField = 'remove_logo',
  
  // File configuration
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  
  // UI Configuration
  buttonText = 'Upload',
  helperText = '',
  
  // Existing file data (from API)
  existingFileUrl = null,
  existingFileName = null,
  
  // Mode
  mode = 'create',
  
  // Callbacks
  onUploadStart,
  onUploadSuccess,
  onUploadError,
  onClear,
}) => {
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [imageError, setImageError] = useState(false);
  const [localFile, setLocalFile] = useState(null);
  const [userCleared, setUserCleared] = useState(false); // NEW: Track if user cleared
  const prevUrlRef = useRef();

  // Debug logs
  console.log('=== FileUploader Render ===', {
    mode,
    existingFileUrl: existingFileUrl ? 'URL exists' : 'null',
    existingFileName,
    previewUrl: previewUrl ? 'Preview set' : 'null',
    fileName,
    imageError,
    localFile: localFile ? 'Yes' : 'No',
    uploading,
    userCleared
  });

  // Handle existing file from API
  useEffect(() => {
    console.log('=== FileUploader Effect ===', {
      mode,
      existingFileUrl: existingFileUrl ? 'URL exists' : 'null',
      previewUrl,
      fileName,
      prevUrl: prevUrlRef.current,
      userCleared
    });

    // If user cleared, don't reset the preview from existingFileUrl
    if (userCleared) {
      console.log('User cleared - ignoring existingFileUrl');
      return;
    }

    // Only run if we have an existing file URL and we're in update mode
    if (mode === 'update' && existingFileUrl) {
      // Check if this is a new URL or if preview is not set
      if (existingFileUrl !== prevUrlRef.current || !previewUrl) {
        console.log('🎯 SETTING PREVIEW FROM API:', existingFileUrl);
        setPreviewUrl(existingFileUrl);
        setFileName(existingFileName || 'Existing logo');
        setImageError(false);
        setLocalFile(null);
        prevUrlRef.current = existingFileUrl;
      }
    } else if (mode === 'create' && !uploading && !localFile && !userCleared) {
      // Reset in create mode if not uploading and no local file
      console.log('Resetting in create mode');
      setPreviewUrl(null);
      setFileName('');
      setImageError(false);
      setLocalFile(null);
    }
  }, [existingFileUrl, existingFileName, mode, uploading, previewUrl, localFile, userCleared]);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file.name);
    setUploading(true);
    setFileName(file.name);
    setImageError(false);
    setLocalFile(file);
    setUserCleared(false); // Reset user cleared flag

    // Create local preview immediately
    const localPreviewUrl = URL.createObjectURL(file);
    console.log('🎯 SETTING LOCAL PREVIEW:', localPreviewUrl);
    setPreviewUrl(localPreviewUrl);

    // Callback
    if (onUploadStart) onUploadStart(file);

    try {
      // Upload to get temp_id
      const resultAction = await dispatch(uploadTempFile(file));
      
      if (uploadTempFile.fulfilled.match(resultAction)) {
        const fileData = resultAction.payload.data;
        console.log('Upload successful:', fileData);
        
        if (fileData && fileData.temp_id) {
          // Set temp_id in formik
          formik.setFieldValue(tempIdField, fileData.temp_id);
          
          // If we're in update mode, make sure remove flag is false
          if (mode === 'update' && removeField) {
            formik.setFieldValue(removeField, false);
          }
          
          // Callback
          if (onUploadSuccess) onUploadSuccess(fileData);
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
      
      // Clear preview on error
      setPreviewUrl(null);
      setFileName('');
      setLocalFile(null);
      URL.revokeObjectURL(localPreviewUrl);
      
      // Callback
      if (onUploadError) onUploadError(error);
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    console.log('Clearing file');
    
    // Clean up local preview URL
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setFileName('');
    setImageError(false);
    setLocalFile(null);
    setUserCleared(true); // Set user cleared flag
    
    // Handle based on mode
    if (mode === 'update' && removeField) {
      console.log('Setting remove_logo = true for update mode');
      formik.setFieldValue(removeField, true);
      formik.setFieldValue(tempIdField, null);
    } else {
      console.log('Clearing temp_id for create mode');
      formik.setFieldValue(tempIdField, null);
    }
    
    // Callback
    if (onClear) onClear();
  };

  const handleImageError = () => {
    console.error('❌ Image failed to load:', previewUrl);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully:', previewUrl);
    setImageError(false);
  };

  // Determine what to display
  const getDisplayContent = () => {
    if (uploading) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Loader size={20} className="animate-spin" />
          <Typography variant="body2">Uploading...</Typography>
        </Box>
      );
    }

    if (previewUrl && !imageError) {
      console.log('Rendering image with URL:', previewUrl);
      return (
        <>
          {/* Preview */}
          <Box
            component="img"
            src={previewUrl}
            alt="Preview"
            sx={{
              height: '80%',
              maxWidth: '80%',
              objectFit: 'contain'
            }}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />

          {/* Clear Icon */}
          <Box
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              '&:hover': { opacity: 0.7 }
            }}
            onClick={handleClear}
          >
            <X size={18} />
          </Box>
        </>
      );
    }

    if (previewUrl && imageError) {
      return (
        <>
          <Typography variant="body2">Preview not available</Typography>
          <Box
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              '&:hover': { opacity: 0.7 }
            }}
            onClick={handleClear}
          >
            <X size={18} />
          </Box>
        </>
      );
    }

    // No file
    return (
      <Button
        variant="contained"
        component="label"
        sx={{
          px: 4,
          borderRadius: 6,
          textTransform: 'none'
        }}
      >
        {buttonText}
        <input
          hidden
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
        />
      </Button>
    );
  };

  return (
    <Box>
      <Box
        sx={{
          border: '1px solid #b9b8b8',
          borderRadius: 1,
          height: 55,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: uploading ? 'action.hover' : 'transparent'
        }}
      >
        {getDisplayContent()}
      </Box>

      {/* File name display */}
      {fileName && (
        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
          {uploading ? 'Uploading: ' : 'Selected: '}{fileName}
        </Typography>
      )}
      
      {/* Helper text */}
      {helperText && !fileName && (
        <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
          {helperText}
        </Typography>
      )}
      
      {/* Error display from formik */}
      {formik.touched[tempIdField] && formik.errors[tempIdField] && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          {formik.errors[tempIdField]}
        </Typography>
      )}
    </Box>
  );
};

export default FileUploader;