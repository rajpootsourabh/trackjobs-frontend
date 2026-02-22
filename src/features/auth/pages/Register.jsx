// features/auth/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Button,
  CircularProgress
} from '@mui/material';
import DebouncedTextField from '../../../components/common/form/DebouncedTextField';
import PasswordField from '../../../components/common/form/PasswordField';
import AuthLayout from '../components/ui/AuthLayout';
import { registerSchema } from '../schemas/validationSchemas';
import { useAuth } from '../hooks/useAuth';
import ErrorDialog from '../../../components/common/ErrorDialog';

const Register = () => {
  const navigate = useNavigate();
  const {
    register: registerUser,
    loading,
    error,
    validationErrors,
    lastErrorCode,
    clearError
  } = useAuth();

  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [currentError, setCurrentError] = useState(null);

  // Handle Redux errors - SHOWS DIALOG FOR ALL ERRORS
  useEffect(() => {
    if (error) {
      // Create error object with full details
      const errorObject = {
        response: {
          data: {
            message: error,
            code: lastErrorCode,
            errors: validationErrors,
            timestamp: new Date().toISOString()
          }
        }
      };

      setCurrentError(errorObject);
      setErrorDialogOpen(true);
    }
  }, [error, lastErrorCode, validationErrors]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Send ALL fields to backend
      const registrationData = {
        business_name: values.business_name,
        website_name: values.website_name,
        full_name: values.full_name,
        email: values.email,
        mobile_number: values.mobile_number,
        password: values.password,
        password_confirmation: values.password_confirmation,
        terms_accepted: values.terms_accepted
      };

      console.log('Sending registration data:', registrationData);

      const result = await registerUser(registrationData);

      if (result) {
        // Navigate to login with success message
        navigate('/auth/login', {
          state: { message: 'Registration successful! Please login to continue.' }
        });
      }
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleErrorAction = (action) => {
    if (action === 'retry') {
      setErrorDialogOpen(false);
      clearError();
    } else if (action === 'contact-support') {
      window.location.href = 'mailto:support@example.com';
    } else if (action === 'login') {
      navigate('/auth/login');
    }
  };

  return (
    <AuthLayout title="SIGN UP" isRegister>
      {/* Error Dialog for ALL errors */}
      <ErrorDialog
        open={errorDialogOpen}
        onClose={() => {
          setErrorDialogOpen(false);
          clearError();
        }}
        error={currentError}
        onAction={handleErrorAction}
      />

      <Paper
        elevation={0}
        sx={{
          p: 1,
          borderRadius: 2,
          maxWidth: 500,
          mx: 'auto',
        }}
      >
        <Formik
          initialValues={{
            business_name: '',
            website_name: '',
            full_name: '',
            email: '',
            mobile_number: '',
            password: '',
            password_confirmation: '',
            terms_accepted: false,
          }}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ isSubmitting, errors, touched, setFieldValue, setFieldTouched, values }) => (
            <Form>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Business Name */}
                <DebouncedTextField
                  name="business_name"
                  label="Business Name"
                  placeholder="Enter your business name"
                  value={values.business_name}
                  onChange={(value) => setFieldValue('business_name', value)}
                  onBlur={() => setFieldTouched('business_name', true)}
                  error={touched.business_name && Boolean(errors.business_name)}
                  helperText={touched.business_name && errors.business_name}
                  required
                  size="medium"
                  disabled={loading}
                />

                {/* Website Name */}
                <DebouncedTextField
                  name="website_name"
                  label="Website Name"
                  placeholder="Enter your website name"
                  value={values.website_name}
                  onChange={(value) => setFieldValue('website_name', value)}
                  onBlur={() => setFieldTouched('website_name', true)}
                  error={touched.website_name && Boolean(errors.website_name)}
                  helperText={touched.website_name && errors.website_name}
                  required
                  size="medium"
                  disabled={loading}
                />

                {/* Full Name */}
                <DebouncedTextField
                  name="full_name"
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={values.full_name}
                  onChange={(value) => setFieldValue('full_name', value)}
                  onBlur={() => setFieldTouched('full_name', true)}
                  error={touched.full_name && Boolean(errors.full_name)}
                  helperText={touched.full_name && errors.full_name}
                  required
                  size="medium"
                  disabled={loading}
                />

                {/* Email */}
                <DebouncedTextField
                  name="email"
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email address"
                  value={values.email}
                  onChange={(value) => setFieldValue('email', value)}
                  onBlur={() => setFieldTouched('email', true)}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  required
                  size="medium"
                  disabled={loading}
                />

                {/* Mobile Number */}
                <DebouncedTextField
                  name="mobile_number"
                  label="Mobile Number"
                  placeholder="Enter your mobile number"
                  value={values.mobile_number}
                  onChange={(value) => setFieldValue('mobile_number', value)}
                  onBlur={() => setFieldTouched('mobile_number', true)}
                  error={touched.mobile_number && Boolean(errors.mobile_number)}
                  helperText={touched.mobile_number && errors.mobile_number}
                  required
                  size="medium"
                  disabled={loading}
                />

                {/* Password */}
                <PasswordField
                  name="password"
                  label="Password"
                  placeholder="Create a password"
                  value={values.password}
                  onChange={(e) => setFieldValue('password', e.target.value)}
                  onBlur={() => setFieldTouched('password', true)}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  required
                  size="medium"
                  disabled={loading}
                />

                {/* Confirm Password */}
                <PasswordField
                  name="password_confirmation"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={values.password_confirmation}
                  onChange={(e) => setFieldValue('password_confirmation', e.target.value)}
                  onBlur={() => setFieldTouched('password_confirmation', true)}
                  error={touched.password_confirmation && Boolean(errors.password_confirmation)}
                  helperText={touched.password_confirmation && errors.password_confirmation}
                  required
                  size="medium"
                  disabled={loading}
                />

                {/* Terms Checkbox */}
                <Box sx={{ mt: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.terms_accepted}
                        onChange={(e) => setFieldValue('terms_accepted', e.target.checked)}
                        onBlur={() => setFieldTouched('terms_accepted', true)}
                        color="primary"
                        size="medium"
                        disabled={loading}
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I agree to the{' '}
                        <Link
                          to="/terms"
                          style={{
                            color: '#1976d2',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          Terms & Conditions
                        </Link>
                      </Typography>
                    }
                  />
                  {touched.terms_accepted && errors.terms_accepted && (
                    <FormHelperText error sx={{ mt: 0.5 }}>
                      {errors.terms_accepted}
                    </FormHelperText>
                  )}
                </Box>

                {/* Form Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || loading}
                    sx={{
                      textTransform: 'none',
                      fontSize: '18px',
                      minWidth: '220px',
                      position: 'relative',
                      minHeight: '45px',
                      borderRadius: '8px'
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={25} color="inherit" />
                    ) : 'Sign Up'}
                  </Button>
                </Box>
              </Box>
            </Form>
          )}
        </Formik>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              style={{
                color: '#1976d2',
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              Login Now
            </Link>
          </Typography>
        </Box>
      </Paper>
    </AuthLayout>
  );
};

export default Register;