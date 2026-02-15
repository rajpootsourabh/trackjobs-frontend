// features/clients/components/ClientTable/ClientCategoryChip.jsx
import React from 'react';
import { Chip } from '@mui/material';

const getCategoryColor = (category) => {
  switch (category?.toLowerCase()) {
    case 'enterprise':
      return { bgcolor: '#fff4e5', color: '#ed6c02' };
    case 'premium':
      return { bgcolor: '#f3f4f6', color: '#374151' };
    default:
      return { bgcolor: '#e3f2fd', color: '#1976d2' };
  }
};

const ClientCategoryChip = ({ category }) => {
  return (
    <Chip
      label={category || 'Regular'}
      size="small"
      sx={{
        ...getCategoryColor(category),
        height: 20,
        '& .MuiChip-label': {
          fontSize: '0.85rem',
          px: 0.9,
          lineHeight: 1,
          padding: '8px',
        }
      }}
    />
  );
};

export default ClientCategoryChip;