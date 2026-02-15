// features/quotes/components/QuoteForm/QuoteFormActions.jsx
import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { Save as SaveIcon, Send as SendIcon, Update as UpdateIcon } from '@mui/icons-material';

const QuoteFormActions = ({
  onCancel,
  isLoading,
  loadingAction, // Add loadingAction prop
  onSave,
  onSaveAndSend,
  isEditMode = false
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
        type="button" // Changed from "submit" to "button"
        variant="contained"
        disabled={isLoading}
        onClick={onSave}
        // startIcon={!isLoading && (isEditMode ? <UpdateIcon /> : <SaveIcon />)}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          minWidth: '120px',
          position: 'relative'
        }}
      >
        {isLoading && loadingAction === 'save' ? (
          <CircularProgress size={24} color="inherit" />
        ) : (isEditMode ? 'Update Quote' : 'Save Quote')}
      </Button>

      {/* {!isEditMode && (
        <Button
          type="button"
          variant="contained"
          disabled={isLoading}
          onClick={onSaveAndSend}
          // startIcon={!isLoading && <SendIcon />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            minWidth: '150px',
            position: 'relative'
          }}
        >
          {isLoading && loadingAction === 'saveAndSend' ? (
            <CircularProgress size={24} color="inherit" />
          ) : 'Save & Send'}
        </Button>
      )} */}
    </Box>
  );
};

export default QuoteFormActions;