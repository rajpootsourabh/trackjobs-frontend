// features/quotes/components/QuoteForm/ConversionToJobSection.jsx
import React from 'react';
import { Box, Typography, Divider, Button, Switch, Paper, Alert } from '@mui/material';
import SectionHeader from '../../../../components/common/form/SectionHeader';

const ConversionToJobSection = ({ formik }) => {
  const handleConvertToJob = () => {
    // This would trigger job creation
    // console.log('Converting quote to job:', formik.values.quote_number);
    // After conversion, job_id would be set
    // formik.setFieldValue('job_id', 'JOB-123456');
    // formik.setFieldValue('converted_at', new Date());
  };

  const isConverted = !!formik.values.job_id;

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
      <SectionHeader
        number="6"
        title="Conversion to Job"
        rightAction={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">Allow Conversion</Typography>
            <Switch
              checked={formik.values.can_convert_to_job}
              onChange={(e) => formik.setFieldValue('can_convert_to_job', e.target.checked)}
              disabled={isConverted}
            />
          </Box>
        }
      />

      {isConverted ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          This quote has been converted to Job #{formik.values.job_id}
        </Alert>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2
          }}
        >
          <Typography>Convert to job</Typography>
          <Button
            variant="contained"
            disabled={!formik.values.can_convert_to_job}
            onClick={handleConvertToJob}
          >
            Convert to Job
          </Button>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Job ID - Auto-populated after conversion */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
        <Typography>Job ID</Typography>
        <Typography sx={{ fontWeight: 500 }}>
          {formik.values.job_id || 'Not Converted'}
        </Typography>
      </Box>

      {/* Converted At - Auto-populated after conversion */}
      {formik.values.converted_at && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
            <Typography>Converted At</Typography>
            <Typography>
              {new Date(formik.values.converted_at).toLocaleString()}
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default ConversionToJobSection;