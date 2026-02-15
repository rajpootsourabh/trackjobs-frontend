import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Alert,
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
import { register } from '../services';

const Register = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState({});
  const [loadingAction, setLoadingAction] = useState(null);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setStatus({});
    setLoadingAction('register');

    try {
      await register(values);
      navigate('/auth/login', {
        state: { message: 'Registration successful! Please login to continue.' }
      });
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setStatus({ apiError: error.message || 'Registration failed. Please try again.' });
      }
    } finally {
      setLoadingAction(null);
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="SIGN UP" isRegister>
      <Paper 
        elevation={0} 
        sx={{ 
          p:1,
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
              {/* Remove any border from the Form itself */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {status?.apiError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {status.apiError}
                  </Alert>
                )}

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
                    disabled={isSubmitting || loadingAction !== null}
                    sx={{
                      textTransform: 'none',
                      fontSize: '18px',
                      // fontWeight: 600,
                      minWidth: '220px',
                      position: 'relative',
                      minHeight:'45px',
                      borderRadius: '8px'
                    }}
                  >
                    {loadingAction === 'register' ? (
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