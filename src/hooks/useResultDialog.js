// hooks/useResultDialog.js
import { useState, useCallback } from 'react';

const useResultDialog = () => {
  const [dialogState, setDialogState] = useState({
    open: false,
    type: 'error',
    title: '',
    message: '',
    errors: {},
    code: null,
    timestamp: null,
    errorCode: null,
    actions: []
  });

  const showDialog = useCallback((options) => {
    setDialogState({
      open: true,
      type: options.type || 'error',
      title: options.title,
      message: options.message,
      errors: options.errors || {},
      code: options.code,
      timestamp: options.timestamp,
      errorCode: options.errorCode,
      actions: options.actions || [
        {
          label: 'Close',
          onClick: (close) => close(),
          variant: 'outlined'
        }
      ]
    });
  }, []);

  const showError = useCallback((error, customActions) => {
    // Handle different error formats
    if (typeof error === 'string') {
      showDialog({
        type: 'error',
        message: error,
        actions: customActions
      });
    } else if (error.response?.data) {
      // API error response
      const data = error.response.data;
      showDialog({
        type: 'error',
        title: data.error_code === 'VALIDATION_ERROR' ? 'Validation Error' : 'Error',
        message: data.message || 'An error occurred',
        errors: data.errors || {},
        code: data.code || error.response.status,
        timestamp: data.timestamp,
        errorCode: data.error_code,
        actions: customActions
      });
    } else if (error.errors) {
      // Direct error object with validation errors
      showDialog({
        type: 'error',
        title: error.error_code === 'VALIDATION_ERROR' ? 'Validation Error' : 'Error',
        message: error.message || 'An error occurred',
        errors: error.errors || {},
        code: error.code,
        timestamp: error.timestamp,
        errorCode: error.error_code,
        actions: customActions
      });
    } else {
      showDialog({
        type: 'error',
        message: error.message || 'An unexpected error occurred',
        actions: customActions
      });
    }
  }, [showDialog]);

  const showSuccess = useCallback((message, options = {}) => {
    showDialog({
      type: 'success',
      message,
      title: options.title || 'Success',
      timestamp: options.timestamp,
      actions: options.actions || [
        {
          label: 'OK',
          onClick: (close) => close(),
          variant: 'contained',
          color: 'success'
        }
      ]
    });
  }, [showDialog]);

  const showWarning = useCallback((message, options = {}) => {
    showDialog({
      type: 'warning',
      message,
      title: options.title || 'Warning',
      errors: options.errors,
      timestamp: options.timestamp,
      actions: options.actions
    });
  }, [showDialog]);

  const showInfo = useCallback((message, options = {}) => {
    showDialog({
      type: 'info',
      message,
      title: options.title || 'Information',
      errors: options.errors,
      timestamp: options.timestamp,
      actions: options.actions
    });
  }, [showDialog]);

  const hideDialog = useCallback(() => {
    setDialogState(prev => ({ ...prev, open: false }));
  }, []);

  return {
    dialogState,
    showDialog,
    showError,
    showSuccess,
    showWarning,
    showInfo,
    hideDialog
  };
};

export default useResultDialog;