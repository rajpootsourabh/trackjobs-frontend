import React from 'react';
import { Grid } from '@mui/material';
import DebouncedTextField from '../../../../components/common/form/DebouncedTextField';

const CommonContactFields = ({ formik }) => {
  return (
    <>
      <Grid item xs={12} md={6}>
        <DebouncedTextField
          name="email"
          label="Email Address"
          type="email"
          value={formik.values.email}
          onChange={(val) => formik.setFieldValue('email', val)}
          onBlur={formik.handleBlur}
          error={formik.touched.email && formik.errors.email}
          helperText={formik.touched.email && formik.errors.email}
          fullWidth
          required  // Added required prop
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <DebouncedTextField
          name="mobile_number"
          label="Mobile Number"
          value={formik.values.mobile_number}
          onChange={(val) => formik.setFieldValue('mobile_number', val)}
          onBlur={formik.handleBlur}
          error={formik.touched.mobile_number && formik.errors.mobile_number}
          helperText={formik.touched.mobile_number && formik.errors.mobile_number}
          fullWidth
          required  // Added required prop
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <DebouncedTextField
          name="alternate_mobile_number"
          label="Alternate Mobile Number"
          value={formik.values.alternate_mobile_number}
          onChange={(val) => formik.setFieldValue('alternate_mobile_number', val)}
          onBlur={formik.handleBlur}
          error={formik.touched.alternate_mobile_number && formik.errors.alternate_mobile_number}
          helperText={formik.touched.alternate_mobile_number && formik.errors.alternate_mobile_number}
          fullWidth
        />
      </Grid>
    </>
  );
};

export default CommonContactFields;