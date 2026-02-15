// features/clients/components/ClientForm/ClientTypeSelector.jsx
import React from 'react';
import {
  Paper,
  Box,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography
} from '@mui/material';
import { Building2, Home, User, Lock } from 'lucide-react';

const ClientTypeSelector = ({ clientType, onChange, formik, mode = 'create' }) => {
  const isEditMode = mode === 'update';

  const handleChange = (event) => {
    if (isEditMode) return;
    const newType = event.target.value;
    onChange(newType);
    formik.setFieldValue('client_type', newType);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 2,
        backgroundColor: '#f8f9fa',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* <User
            size={20}
            style={{
              marginRight: '8px',
              color: clientType === 'residential' ? '#1976d2' : '#6c757d'
            }}
          /> */}
          {isEditMode && <Lock size={16} style={{ marginLeft: '4px', color: '#6c757d' }} />}
        </Box>

        <FormLabel component="legend" sx={{ fontWeight: 500, mr: 2 }}>
          Customer Type:
        </FormLabel>

        <RadioGroup
          row
          value={clientType}
          onChange={handleChange}
          sx={{ alignItems: 'center' }}
        >
          <FormControlLabel
            value="commercial"
            control={<Radio />}
            disabled={isEditMode}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Building2 size={16} style={{ marginRight: '6px' }} />
                Commercial
              </Box>
            }
            sx={{
              mr: 3,
              '& .MuiFormControlLabel-label': {
                display: 'flex',
                alignItems: 'center'
              }
            }}
          />

          <FormControlLabel
            value="residential"
            control={<Radio />}
            disabled={isEditMode}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Home size={16} style={{ marginRight: '6px' }} />
                Residential
              </Box>
            }
            sx={{
              '& .MuiFormControlLabel-label': {
                display: 'flex',
                alignItems: 'center'
              }
            }}
          />
        </RadioGroup>

        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
          {clientType === 'commercial'
            ? 'Business customer with company details'
            : 'Individual customer with personal details'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ClientTypeSelector;