// features/online-booking/components/BookingForm/FormActions.jsx
import React from 'react';
import { Box, Button } from '@mui/material';

const FormActions = ({ onCancel, isLoading, onNext, onBack, activeStep, steps }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
      <Button
        variant="outlined"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {activeStep > 0 && (
          <Button
            onClick={onBack}
            disabled={isLoading}
          >
            Back
          </Button>
        )}
        <Button
          variant="contained"
          onClick={onNext}
          disabled={isLoading}
        >
          {activeStep === steps.length - 1 ? 'Confirm' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
};

export default FormActions;