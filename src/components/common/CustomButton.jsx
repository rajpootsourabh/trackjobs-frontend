import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const CustomButton = ({
  label = 'Button',
  icon: Icon,
  onClick,
  to,
  loading = false,
  variant = 'contained',
  size = 'medium',
  disabled = false,
  sx = {},
  ...props
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      startIcon={!loading && Icon ? <Icon /> : null}
      onClick={onClick}
      component={to ? RouterLink : 'button'}
      to={to}
      disabled={loading || disabled}
      sx={{
        textTransform: 'none',
        borderRadius: 1,
        ...sx
      }}
      {...props}
    >
      {loading ? <CircularProgress size={18} /> : label}
    </Button>
  );
};

export default CustomButton;
