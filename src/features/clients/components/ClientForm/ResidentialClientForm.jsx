// features/clients/components/ClientForm/ResidentialClientForm.jsx
import React from 'react';
import { Grid, Paper } from '@mui/material';
import SectionHeader from '../../../../components/common/form/SectionHeader';
import DebouncedTextField from '../../../../components/common/form/DebouncedTextField';
import DebouncedSelect from '../../../../components/common/form/DebouncedSelect'; // <-- add
import CommonContactFields from './CommonContactFields';
import CommonAddressFields from './CommonAddressFields';
import { getCategoryOptionsByClientType } from '../../constants/clientConstants'; // <-- add

const ResidentialClientForm = ({ formik }) => {
  const categoryOptions = getCategoryOptionsByClientType('residential');

  return (
    <>
      {/* Personal Details */}
      <Paper elevation={0} sx={{ p: 0, mb: 4, borderRadius: 2, backgroundColor: '#fff' }}>
        <SectionHeader number="1" title="Personal Details" />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <DebouncedTextField
              name="first_name"
              label="First Name"
              value={formik.values.first_name}
              onChange={(val) => formik.setFieldValue('first_name', val)}
              onBlur={formik.handleBlur}
              required
              error={formik.touched.first_name && formik.errors.first_name}
              helperText={formik.touched.first_name && formik.errors.first_name}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DebouncedTextField
              name="last_name"
              label="Last Name"
              value={formik.values.last_name}
              onChange={(val) => formik.setFieldValue('last_name', val)}
              onBlur={formik.handleBlur}
              error={formik.touched.last_name && formik.errors.last_name}
              helperText={formik.touched.last_name && formik.errors.last_name}
              fullWidth
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Contact Information */}
      <Paper elevation={0} sx={{ p: 0, mb: 4, borderRadius: 2, backgroundColor: '#fff' }}>
        <SectionHeader number="2" title="Contact Information" />
        <Grid container spacing={3}>
          <CommonContactFields formik={formik} />
        </Grid>
      </Paper>

      {/* Address */}
      <Paper elevation={0} sx={{ p: 0, mb: 4, borderRadius: 2, backgroundColor: '#fff' }}>
        <SectionHeader number="3" title="Address" />
        <Grid container spacing={3}>
          <CommonAddressFields formik={formik} />
        </Grid>
      </Paper>

      <Paper elevation={0} sx={{ p: 0, mb: 4, borderRadius: 2, backgroundColor: '#fff' }}>
        <SectionHeader number="4" title="Service Category" />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <DebouncedSelect
              name="service_category"
              label="Service Category"
              value={formik.values.service_category}
              onChange={(value) => formik.setFieldValue('service_category', value)}
              options={categoryOptions}
              error={formik.touched.service_category && formik.errors.service_category}
              helperText={formik.touched.service_category && formik.errors.service_category}
              fullWidth
              required
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default ResidentialClientForm;