import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import {
  Box,
  Paper,
  Typography,
  Alert,
  Button,
  CircularProgress
} from '@mui/material';
import AuthLayout from '../components/ui/AuthLayout';
import DebouncedTextField from '../../../components/common/form/DebouncedTextField';
import PasswordField from '../../../components/common/form/PasswordField';
import { loginSchema } from '../schemas/validationSchemas';
import { login } from '../services';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccessMessage, setShowSuccessMessage] = useState('');
  const [loadingAction, setLoadingAction] = useState(null);
  const [status, setStatus] = useState({});

  useEffect(() => {
    if (location.state?.message) {
      setShowSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setStatus({});
    setLoadingAction('login');

    try {
      await login(values);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setStatus({ apiError: error.message || 'Login failed. Please check your credentials.' });
      }
    } finally {
      setLoadingAction(null);
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="LOGIN">
      <Paper
        elevation={0}
        sx={{
          p: 1,
          maxWidth: 500,
          mx: 'auto',
        }}
      >
        <Formik
          initialValues={{
            email: '',
            password: ''
          }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ isSubmitting, errors, touched, setFieldValue, setFieldTouched, values }) => (
            <Form>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Success Message */}
                {showSuccessMessage && (
                  <Alert severity="success" sx={{ mb: 2 }} onClose={() => setShowSuccessMessage('')}>
                    {showSuccessMessage}
                  </Alert>
                )}

                {/* Error Message */}
                {status?.apiError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {status.apiError}
                  </Alert>
                )}

                {/* Email Field */}
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

                {/* Password Field */}
                <PasswordField
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  value={values.password}
                  onChange={(e) => setFieldValue('password', e.target.value)}
                  onBlur={() => setFieldTouched('password', true)}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  required
                  size="medium"
                />

                {/* Forgot Password Link */}
                <Box sx={{ textAlign: 'right', mt: -1 }}>
                  <Link
                    to="/auth/forgot-password"
                    style={{
                      color: '#1976d2',
                      textDecoration: 'none',
                      fontSize: '0.875rem'
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Box>

                {/* Form Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
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
                      minHeight: '45px',
                      borderRadius: '8px'
                    }}
                  >
                    {loadingAction === 'login' ? (
                      <CircularProgress size={25} color="inherit" />
                    ) : 'Login'}
                  </Button>
                </Box>
              </Box>
            </Form>
          )}
        </Formik>

        {/* Register Link */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            If you haven't Registered yet?{' '}
            <Link
              to="/auth/register"
              style={{
                color: '#1976d2',
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              Register Now
            </Link>
          </Typography>
        </Box>
      </Paper>
    </AuthLayout>
  );
};

export default Login;