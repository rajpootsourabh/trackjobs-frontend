// features/clients/components/ClientTable/ClientCategoryChip.jsx
import React from 'react';
import { Chip } from '@mui/material';
import {
  RESIDENTIAL_CATEGORY_OPTIONS,
  COMMERCIAL_CATEGORY_OPTIONS
} from '../../constants/clientConstants';

// Color mapping for different category types
const getCategoryColor = (category, clientType) => {
  const categoryLower = category?.toLowerCase();
  
  // Residential category colors
  const residentialColors = {
    handyman: { bgcolor: '#4caf50', color: '#ffffff' }, // Green
    plumbing: { bgcolor: '#2196f3', color: '#ffffff' }, // Blue
    electrical: { bgcolor: '#ff9800', color: '#ffffff' }, // Orange
    hvac: { bgcolor: '#9c27b0', color: '#ffffff' }, // Purple
    home_cleaning: { bgcolor: '#00bcd4', color: '#ffffff' }, // Cyan
    roof_repair: { bgcolor: '#795548', color: '#ffffff' }, // Brown
    home_renovation: { bgcolor: '#ff5722', color: '#ffffff' }, // Deep Orange
    landscaping: { bgcolor: '#8bc34a', color: '#ffffff' }, // Light Green
    pest_control: { bgcolor: '#607d8b', color: '#ffffff' }, // Blue Grey
    appliance_repair: { bgcolor: '#e91e63', color: '#ffffff' }, // Pink
    flooring: { bgcolor: '#ffc107', color: '#000000' }, // Amber
    painting: { bgcolor: '#9e9e9e', color: '#ffffff' }, // Grey
    window_glass: { bgcolor: '#03a9f4', color: '#ffffff' }, // Light Blue
    home_security: { bgcolor: '#3f51b5', color: '#ffffff' }, // Indigo
    pool_maintenance: { bgcolor: '#009688', color: '#ffffff' }, // Teal
  };
  
  // Commercial category colors
  const commercialColors = {
    commercial_plumbing: { bgcolor: '#1565c0', color: '#ffffff' }, // Darker Blue
    commercial_electrical: { bgcolor: '#ef6c00', color: '#ffffff' }, // Darker Orange
    commercial_hvac: { bgcolor: '#6a1b9a', color: '#ffffff' }, // Darker Purple
    commercial_cleaning: { bgcolor: '#006064', color: '#ffffff' }, // Darker Cyan
    commercial_roofing: { bgcolor: '#4e342e', color: '#ffffff' }, // Darker Brown
    office_renovation: { bgcolor: '#bf360c', color: '#ffffff' }, // Darker Deep Orange
    commercial_landscaping: { bgcolor: '#558b2f', color: '#ffffff' }, // Darker Light Green
    fire_protection: { bgcolor: '#c62828', color: '#ffffff' }, // Dark Red
    commercial_security: { bgcolor: '#1a237e', color: '#ffffff' }, // Darker Indigo
    elevator_maintenance: { bgcolor: '#424242', color: '#ffffff' }, // Dark Grey
    industrial_equipment: { bgcolor: '#37474f', color: '#ffffff' }, // Dark Blue Grey
    commercial_flooring: { bgcolor: '#ff8f00', color: '#ffffff' }, // Dark Amber
    signage_installation: { bgcolor: '#4a148c', color: '#ffffff' }, // Dark Purple
    it_network: { bgcolor: '#0d47a1', color: '#ffffff' }, // Dark Blue
    facility_management: { bgcolor: '#bf5b17', color: '#ffffff' }, // Brown Orange
  };
  
  // Legacy/fallback colors (for backward compatibility)
  const legacyColors = {
    enterprise: { bgcolor: '#fff4e5', color: '#ed6c02' },
    premium: { bgcolor: '#f3f4f6', color: '#374151' },
    vip: { bgcolor: '#f3e5f5', color: '#7b1fa2' },
    strategic: { bgcolor: '#e8eaf6', color: '#283593' },
    new: { bgcolor: '#e8f5e8', color: '#2e7d32' },
    at_risk: { bgcolor: '#ffebee', color: '#c62828' },
    regular: { bgcolor: '#e3f2fd', color: '#1976d2' },
  };
  
  // Check residential colors
  if (clientType === 'residential' && residentialColors[categoryLower]) {
    return residentialColors[categoryLower];
  }
  
  // Check commercial colors
  if (clientType === 'commercial' && commercialColors[categoryLower]) {
    return commercialColors[categoryLower];
  }
  
  // Check legacy colors
  if (legacyColors[categoryLower]) {
    return legacyColors[categoryLower];
  }
  
  // Default fallback
  return { bgcolor: '#e3f2fd', color: '#1976d2' };
};

// Helper function to get display label for category
const getCategoryLabel = (category, clientType) => {
  if (!category) return 'Regular';
  
  // Try to find in residential options
  if (clientType === 'residential') {
    const option = RESIDENTIAL_CATEGORY_OPTIONS.find(opt => opt.value === category);
    if (option) return option.label;
  }
  
  // Try to find in commercial options
  if (clientType === 'commercial') {
    const option = COMMERCIAL_CATEGORY_OPTIONS.find(opt => opt.value === category);
    if (option) return option.label;
  }
  
  // Fallback: Format the category value nicely
  return category
    .split(/[_-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const ClientCategoryChip = ({ category, clientType, size = 'small' }) => {
  const displayLabel = getCategoryLabel(category, clientType);
  const colors = getCategoryColor(category, clientType);
  
  return (
    <Chip
      label={displayLabel}
      size={size}
      sx={{
        backgroundColor: colors.bgcolor,
        color: colors.color,
        height: size === 'small' ? 24 : 28,
        '& .MuiChip-label': {
          fontSize: size === 'small' ? '0.75rem' : '0.875rem',
          fontWeight: 500,
          px: 1.5,
          lineHeight: 1,
        }
      }}
    />
  );
};

export default ClientCategoryChip;