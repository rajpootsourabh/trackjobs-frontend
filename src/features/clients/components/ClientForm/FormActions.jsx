// features/clients/components/ClientForm/FormActions.jsx
import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';

const FormActions = ({
  onCancel,
  isLoading,
  loadingAction,
  onSave,  // Add onSave prop
  onSaveAndCreateQuote
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
      <Button
        variant="outlined"
        onClick={onCancel}
        disabled={isLoading}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          minWidth: '100px'
        }}
      >
        Cancel
      </Button>

      <Button
        type="button"  // Changed from "submit" to "button"
        variant="contained"
        disabled={isLoading}
        onClick={onSave}  // Use the onSave handler
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          minWidth: '100px',
          position: 'relative'
        }}
      >
        {isLoading && loadingAction === 'save' ? (
          <CircularProgress size={24} color="inherit" />
        ) : 'Save'}
      </Button>

      {/* <Button
        type="button"
        variant="contained"
        disabled={isLoading}
        onClick={onSaveAndCreateQuote}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          minWidth: '150px',
          position: 'relative'
        }}
      >
        {isLoading && loadingAction === 'saveAndCreate' ? (
          <CircularProgress size={24} color="inherit" />
        ) : 'Save & Create Quote'}
      </Button> */}
    </Box>
  );
};

export default FormActions;