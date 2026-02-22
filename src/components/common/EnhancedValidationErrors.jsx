// components/common/EnhancedValidationErrors.jsx
import React, { useState, useEffect } from 'react';
import {
  Alert,
  AlertTitle,
  Collapse,
  Box,
  IconButton,
  Typography,
  Paper,
  Slide
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { InfoOutlined } from '@mui/icons-material';

const severityIcons = {
  error: <ErrorOutlineIcon fontSize="inherit" />,
  warning: <WarningAmberIcon fontSize="inherit" />,
  info: <InfoOutlined fontSize="inherit" />,
  success: <CheckCircleOutlineIcon fontSize="inherit" />
};

const EnhancedValidationErrors = ({
  errors = {},
  apiError = '',
  title = 'Validation Error',
  severity = 'error',
  variant = 'standard',
  dismissible = true,
  onDismiss,
  autoHideDuration,
  showFieldNames = true,
  maxErrors = 10,
  groupSimilar = false,
  animation = 'collapse', // 'collapse', 'slide', or 'none'
  sx = {},
  ...props
}) => {
  const [open, setOpen] = useState(true);
  const [displayedErrors, setDisplayedErrors] = useState([]);

  useEffect(() => {
    // Process and format errors
    const errorList = [];
    
    // Add field errors
    if (errors && typeof errors === 'object' && Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          messages.forEach(message => {
            errorList.push({
              field: showFieldNames ? field : null,
              message,
              key: `${field}-${message}`
            });
          });
        } else if (typeof messages === 'string') {
          errorList.push({
            field: showFieldNames ? field : null,
            message: messages,
            key: `${field}-${messages}`
          });
        }
      });
    }
    
    // Add API error
    if (apiError) {
      errorList.push({
        field: null,
        message: apiError,
        key: `api-${apiError}`
      });
    }

    // Limit number of errors shown
    setDisplayedErrors(errorList.slice(0, maxErrors));
  }, [errors, apiError, showFieldNames, maxErrors]);

  useEffect(() => {
    if (autoHideDuration && open) {
      const timer = setTimeout(() => {
        setOpen(false);
        if (onDismiss) onDismiss();
      }, autoHideDuration);
      
      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, open, onDismiss]);

  const handleClose = () => {
    setOpen(false);
    if (onDismiss) onDismiss();
  };

  const renderContent = () => {
    if (displayedErrors.length === 0) return null;

    const totalErrors = Object.keys(errors).length + (apiError ? 1 : 0);
    const hasMoreErrors = totalErrors > maxErrors;

    if (displayedErrors.length === 1 && displayedErrors[0].field === null) {
      // Single API error
      return (
        <Alert
          severity={severity}
          variant={variant}
          icon={severityIcons[severity]}
          action={
            dismissible && (
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={handleClose}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            )
          }
          sx={{ mb: 2, ...sx }}
          {...props}
        >
          {title && <AlertTitle>{title}</AlertTitle>}
          {displayedErrors[0].message}
        </Alert>
      );
    }

    // Multiple errors
    return (
      <Alert
        severity={severity}
        variant={variant}
        icon={severityIcons[severity]}
        action={
          dismissible && (
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          )
        }
        sx={{ mb: 2, ...sx }}
        {...props}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        <Box component="ul" sx={{ mt: 0, mb: 0, pl: 2 }}>
          {displayedErrors.map((error) => (
            <li key={error.key}>
              <Typography variant="body2">
                {error.field ? (
                  <>
                    <strong>{formatFieldName(error.field)}:</strong> {error.message}
                  </>
                ) : (
                  error.message
                )}
              </Typography>
            </li>
          ))}
          {hasMoreErrors && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              And {totalErrors - maxErrors} more error(s)
            </Typography>
          )}
        </Box>
      </Alert>
    );
  };

  // Apply animation
  if (animation === 'collapse') {
    return (
      <Collapse in={open}>
        {renderContent()}
      </Collapse>
    );
  } else if (animation === 'slide') {
    return (
      <Slide direction="down" in={open} mountOnEnter unmountOnExit>
        <Box>
          {renderContent()}
        </Box>
      </Slide>
    );
  } else {
    return open ? renderContent() : null;
  }
};

// Helper function to format field names
const formatFieldName = (field) => {
  return field
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default EnhancedValidationErrors;