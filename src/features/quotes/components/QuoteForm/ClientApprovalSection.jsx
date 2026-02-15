// features/quotes/components/QuoteForm/ClientApprovalSection.jsx
import React from 'react';
import {
  Box,
  Typography,
  Divider,
  TextField,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import SectionHeader from '../../../../components/common/form/SectionHeader';

const ClientApprovalSection = ({ formik }) => {
  const formatDate = (date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-GB');
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: '1px solid #e5e7eb',
        height: '100%'
      }}
    >
      <SectionHeader number="4" title="Client Approval" />

      {/* Approval Status - User Input */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 1
        }}
      >
        <Typography>Approval Status</Typography>
        <Select
          value={formik.values.approval_status}
          onChange={(e) => {
            formik.setFieldValue('approval_status', e.target.value);
            // Auto-set approval date when status changes to accepted/rejected
            if (e.target.value !== 'pending') {
              formik.setFieldValue('approval_date', new Date());
              formik.setFieldValue('approval_action_date', new Date());
            }
          }}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="accepted">Accepted</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
        </Select>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Client Signature - User Input */}
      <Box sx={{ py: 1 }}>
        <Typography sx={{ mb: 1 }}>Client Signature</Typography>
        <TextField
          multiline
          rows={3}
          fullWidth
          placeholder="Client signature or name"
          value={formik.values.client_signature}
          onChange={(e) => formik.setFieldValue('client_signature', e.target.value)}
          disabled={formik.values.approval_status === 'pending'}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Approval Date - Auto-calculated */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
        <Typography>Approval Date</Typography>
        <Typography sx={{ fontWeight: 500 }}>
          {formatDate(formik.values.approval_date)}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Approval Action Date - Auto-calculated */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
        <Typography>Approval Action</Typography>
        <Typography sx={{ fontWeight: 500 }}>
          {formatDate(formik.values.approval_action_date || formik.values.approval_date)}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ClientApprovalSection;