import React from 'react';
import { Grid } from '@mui/material';
import DebouncedTextField from '../../../../components/common/form/DebouncedTextField';
import DebouncedSelect from '../../../../components/common/form/DebouncedSelect';
import { STATE_OPTIONS, COUNTRY_OPTIONS } from '../../constants/clientConstants';

const CommonAddressFields = ({ formik }) => {
    return (
        <>
            <Grid item xs={12} md={6}>
                <DebouncedTextField
                    name="address_line_1"
                    label="Address Line 1"
                    value={formik.values.address_line_1}
                    onChange={(val) => formik.setFieldValue('address_line_1', val)}
                    onBlur={formik.handleBlur}
                    error={formik.touched.address_line_1 && formik.errors.address_line_1}
                    helperText={formik.touched.address_line_1 && formik.errors.address_line_1}
                    fullWidth
                    required  // Added required prop
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <DebouncedTextField
                    name="address_line_2"
                    label="Address Line 2"
                    value={formik.values.address_line_2}
                    onChange={(val) => formik.setFieldValue('address_line_2', val)}
                    onBlur={formik.handleBlur}
                    error={formik.touched.address_line_2 && formik.errors.address_line_2}
                    helperText={formik.touched.address_line_2 && formik.errors.address_line_2}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <DebouncedTextField
                    name="city"
                    label="City"
                    value={formik.values.city}
                    onChange={(val) => formik.setFieldValue('city', val)}
                    onBlur={formik.handleBlur}
                    error={formik.touched.city && formik.errors.city}
                    helperText={formik.touched.city && formik.errors.city}
                    fullWidth
                    required  // Added required prop
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <DebouncedSelect
                    name="state"
                    label="State"
                    value={formik.values.state}
                    onChange={(val) => formik.setFieldValue('state', val)}
                    options={STATE_OPTIONS}
                    error={formik.touched.state && formik.errors.state}
                    helperText={formik.touched.state && formik.errors.state}
                    fullWidth
                    required  // Added required prop
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <DebouncedSelect
                    name="country"
                    label="Country"
                    value={formik.values.country}
                    onChange={(val) => formik.setFieldValue('country', val)}
                    options={COUNTRY_OPTIONS}
                    error={formik.touched.country && formik.errors.country}
                    helperText={formik.touched.country && formik.errors.country}
                    fullWidth
                    required  // Added required prop
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <DebouncedTextField
                    name="zip_code"
                    label="Zip / Postal Code"
                    value={formik.values.zip_code}
                    onChange={(val) => formik.setFieldValue('zip_code', val)}
                    onBlur={formik.handleBlur}
                    error={formik.touched.zip_code && formik.errors.zip_code}
                    helperText={formik.touched.zip_code && formik.errors.zip_code}
                    fullWidth
                    required  // Added required prop
                />
            </Grid>
        </>
    );
};

export default CommonAddressFields;