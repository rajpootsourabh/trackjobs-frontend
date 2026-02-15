import React from 'react';
import { Chip } from '@mui/material';

const STATUS_STYLES = {
  active: { bg: '#e8f5e9', color: '#2e7d32', label: 'Active' },
  inactive: { bg: '#fdecea', color: '#d32f2f', label: 'Inactive' },
  pending: { bg: '#fff3e0', color: '#ed6c02', label: 'Pending' },
  suspended: { bg: '#eceff1', color: '#546e7a', label: 'Suspended' },
};

const StatusChip = ({ status = 'inactive', size = 'small', sx = {} }) => {
  const key = status?.toLowerCase();
  const style = STATUS_STYLES[key] || STATUS_STYLES.inactive;

  return (
    <Chip
      label={style.label || status}
      size={size}
      sx={{
        height: 20,
        bgcolor: style.bg,
        color: style.color,
        '& .MuiChip-label': {
          fontSize: '0.80rem',
          px: 0.6,
          lineHeight: 1,
        },
        ...sx,
      }}
    />
  );
};

export default StatusChip;
