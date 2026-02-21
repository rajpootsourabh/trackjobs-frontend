// components/common/FileUploader/FileUploader.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { X, Loader, CheckCircle, FileText, File } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { uploadTempFile } from '../../store/slices/fileUploadSlice';
import EllipsisText from './EllipsisText';

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
  successMessage = 'File uploaded successfully',

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
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [imageError, setImageError] = useState(false);
  const [localFile, setLocalFile] = useState(null);
  const [userCleared, setUserCleared] = useState(false);
  const prevUrlRef = useRef();
  const errorTimeoutRef = useRef();
  const successTimeoutRef = useRef();

  // Debug logs (keep your existing logs)
  console.log('🔍 FileUploader Render - Formik State:', {
    tempIdField,
    fieldValue: formik.values[tempIdField],
    fieldError: formik.errors[tempIdField],
    fieldTouched: formik.touched[tempIdField],
    allErrors: formik.errors,
    allValues: formik.values
  });

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  // Handle existing file from API
  useEffect(() => {
    if (userCleared) {
      return;
    }

    if (mode === 'update' && existingFileUrl) {
      if (existingFileUrl !== prevUrlRef.current || !previewUrl) {
        setPreviewUrl(existingFileUrl);
        setFileName(existingFileName || 'Existing file');
        setImageError(false);
        setLocalFile(null);
        setUploadSuccess(true);
        prevUrlRef.current = existingFileUrl;
        
        // Auto-hide success message
        successTimeoutRef.current = setTimeout(() => {
          setUploadSuccess(false);
        }, 3000);
      }
    } else if (mode === 'create' && !uploading && !localFile && !userCleared) {
      setPreviewUrl(null);
      setFileName('');
      setImageError(false);
      setLocalFile(null);
      setUploadSuccess(false);
    }
  }, [existingFileUrl, existingFileName, mode, uploading, previewUrl, localFile, userCleared]);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Clear timeouts
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);

    setUploadSuccess(false);

    // Check file size
    if (file.size > maxSize) {
      const errorMsg = `File size must be under ${Math.round(maxSize / 1024 / 1024)} MB`;
      
      event.target.value = '';
      setPreviewUrl(null);
      setFileName('');
      setLocalFile(null);
      setUserCleared(true);

      formik.setFieldTouched(tempIdField, true, false);
      formik.setFieldError(tempIdField, errorMsg);
      formik.setFieldValue(tempIdField, null, false);
      
      errorTimeoutRef.current = setTimeout(() => {
        if (formik.errors[tempIdField] !== errorMsg) {
          formik.setFieldError(tempIdField, errorMsg);
        }
      }, 100);
      
      if (mode === 'update' && removeField) {
        formik.setFieldValue(removeField, true, false);
      }

      return;
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      const errorMsg = `File type not allowed. Please upload: ${allowedTypes.map(type => type.split('/')[1]).join(', ')}`;
      
      event.target.value = '';
      setPreviewUrl(null);
      setFileName('');
      setLocalFile(null);
      setUserCleared(true);

      formik.setFieldTouched(tempIdField, true, false);
      formik.setFieldError(tempIdField, errorMsg);
      formik.setFieldValue(tempIdField, null, false);
      
      errorTimeoutRef.current = setTimeout(() => {
        if (formik.errors[tempIdField] !== errorMsg) {
          formik.setFieldError(tempIdField, errorMsg);
        }
      }, 100);
      
      if (mode === 'update' && removeField) {
        formik.setFieldValue(removeField, true, false);
      }

      return;
    }

    // Validation passed
    setUploading(true);
    setFileName(file.name);
    setImageError(false);
    setLocalFile(file);
    setUserCleared(false);
    formik.setFieldError(tempIdField, undefined);

    // Create local preview (works for all file types)
    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(localPreviewUrl);

    if (onUploadStart) onUploadStart(file);

    try {
      const resultAction = await dispatch(uploadTempFile(file));

      if (uploadTempFile.fulfilled.match(resultAction)) {
        const fileData = resultAction.payload.data;

        if (fileData && fileData.temp_id) {
          formik.setFieldError(tempIdField, undefined);
          formik.setFieldValue(tempIdField, fileData.temp_id, false);

          if (mode === 'update' && removeField) {
            formik.setFieldValue(removeField, false, false);
          }

          setUploadSuccess(true);
          successTimeoutRef.current = setTimeout(() => {
            setUploadSuccess(false);
          }, 3000);

          if (onUploadSuccess) onUploadSuccess(fileData);
        }
      } else {
        const errorMsg = 'File upload failed. Please try again.';
        formik.setFieldError(tempIdField, errorMsg);
        
        errorTimeoutRef.current = setTimeout(() => {
          if (formik.errors[tempIdField] !== errorMsg) {
            formik.setFieldError(tempIdField, errorMsg);
          }
        }, 100);
        
        setPreviewUrl(null);
        setFileName('');
        setLocalFile(null);
        URL.revokeObjectURL(localPreviewUrl);

        if (onUploadError) onUploadError(new Error(errorMsg));
      }
    } catch (error) {
      const errorMsg = error.message || 'File upload failed. Please try again.';
      formik.setFieldError(tempIdField, errorMsg);
      
      errorTimeoutRef.current = setTimeout(() => {
        if (formik.errors[tempIdField] !== errorMsg) {
          formik.setFieldError(tempIdField, errorMsg);
        }
      }, 100);

      setPreviewUrl(null);
      setFileName('');
      setLocalFile(null);
      URL.revokeObjectURL(localPreviewUrl);

      if (onUploadError) onUploadError(error);
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setFileName('');
    setImageError(false);
    setLocalFile(null);
    setUserCleared(true);
    setUploadSuccess(false);
    formik.setFieldError(tempIdField, undefined);

    if (mode === 'update' && removeField) {
      formik.setFieldValue(removeField, true, false);
      formik.setFieldValue(tempIdField, null, false);
    } else {
      formik.setFieldValue(tempIdField, null, false);
    }

    if (onClear) onClear();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  // File icon component
  const FileIcon = ({ fileName }) => {
    if (!fileName) return <File size={20} />;
    
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    switch(ext) {
      case 'pdf':
        return <Typography sx={{ color: 'error.main', fontWeight: 'bold', fontSize: '0.75rem' }}>PDF</Typography>;
      case 'doc':
      case 'docx':
        return <Typography sx={{ color: 'primary.main', fontWeight: 'bold', fontSize: '0.75rem' }}>DOC</Typography>;
      case 'xls':
      case 'xlsx':
        return <Typography sx={{ color: 'success.main', fontWeight: 'bold', fontSize: '0.75rem' }}>XLS</Typography>;
      case 'txt':
        return <Typography sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: '0.75rem' }}>TXT</Typography>;
      default:
        return <FileText size={20} />;
    }
  };

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
      const isImage = localFile?.type?.startsWith('image/') || 
                      (fileName && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileName));
      
      if (isImage) {
        // Image preview
        return (
          <>
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
      } else {
        // Non-image file display with preview button
        return (
          <>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              width: '100%',
              px: 1,
              gap: 1
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                <FileIcon fileName={fileName} />
                <EllipsisText 
                  text={fileName} 
                  variant="caption"
                  sx={{ maxWidth: '100px' }}
                />
              </Box>
              <Button
                size="small"
                variant="outlined"
                onClick={() => window.open(previewUrl, '_blank')}
                sx={{ 
                  minWidth: 'auto',
                  py: 0.5,
                  px: 1,
                  fontSize: '0.7rem',
                  textTransform: 'none'
                }}
              >
                Preview
              </Button>
            </Box>
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

  const getHelperText = () => {
    if (formik.errors[tempIdField]) {
      return formik.errors[tempIdField];
    }
    
    if (uploadSuccess && fileName) {
      return successMessage;
    }
    
    if (!fileName) {
      return helperText;
    }
    
    return '';
  };

  const helperTextToShow = getHelperText();
  const hasError = !!formik.errors[tempIdField];
  const isSuccess = uploadSuccess && !hasError;

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
          bgcolor: uploading ? 'action.hover' : 'transparent',
          ...(hasError && {
            borderColor: 'error.main',
            borderWidth: 2
          }),
          ...(isSuccess && {
            borderColor: 'success.main',
            borderWidth: 2
          })
        }}
      >
        {getDisplayContent()}
      </Box>

      {uploading && (
        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
          Uploading: {fileName}
        </Typography>
      )}

      {helperTextToShow && (
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {isSuccess && <CheckCircle size={16} color="success.main" />}
          <EllipsisText
            text={helperTextToShow}
            variant="caption"
            sx={{
              display: 'block',
              color: hasError ? 'error.main' : isSuccess ? 'success.main' : 'text.secondary',
              maxWidth: '100%'
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default FileUploader;