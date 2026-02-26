// features/employees/components/EmployeeForm/ContactDetails.jsx
import React from "react";
import { Grid } from "@mui/material";
import DebouncedTextField from "../../../../components/common/form/DebouncedTextField";

const ContactDetails = ({ formik }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <DebouncedTextField
          name="email"  // Add name attribute
          label="Email ID"
          placeholder="Enter Email ID"
          value={formik.values.email}
          onChange={(val) => formik.setFieldValue("email", val)}
          onBlur={formik.handleBlur}  // Use Formik's handleBlur
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          fullWidth
          required
        />
      </Grid>

      <Grid item xs={6}>
        <DebouncedTextField
          name="mobile_number"  // Add name attribute
          label="Mobile Number"
          placeholder="Enter Mobile Number"
          value={formik.values.mobile_number}
          onChange={(val) => formik.setFieldValue("mobile_number", val)}
          onBlur={formik.handleBlur}  // Use Formik's handleBlur
          error={formik.touched.mobile_number && Boolean(formik.errors.mobile_number)}
          helperText={formik.touched.mobile_number && formik.errors.mobile_number}
          fullWidth
          required
        />
      </Grid>

      <Grid item xs={12}>
        <DebouncedTextField
          name="address"  // Add name attribute
          label="Address"
          placeholder="Enter Address"
          multiline
          rows={2}
          value={formik.values.address}
          onChange={(val) => formik.setFieldValue("address", val)}
          onBlur={formik.handleBlur}  // Use Formik's handleBlur
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

export default ContactDetails;