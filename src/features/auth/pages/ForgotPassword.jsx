import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { forgotPasswordSchema } from '../schemas/validationSchemas';
import { forgotPassword } from '../services';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loadingAction, setLoadingAction] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [status, setStatus] = useState({});

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setStatus({});
    setLoadingAction('forgot');

    try {
      await forgotPassword(values);
      setIsSubmitted(true);
      setSuccessMessage('Password reset link sent to your email. Please check your inbox.');
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setStatus({ apiError: error.message || 'Failed to send reset link. Please try again.' });
      }
    } finally {
      setLoadingAction(null);
      setSubmitting(false);
    }
  };

  const handleResend = () => {
    setIsSubmitted(false);
    setSuccessMessage('');
  };

  return (
    <AuthLayout title="FORGOT PASSWORD">
      <Paper
        elevation={0}
        sx={{
          p: 1,
          maxWidth: 450,
          mx: 'auto',
        }}
      >
        {!isSubmitted ? (
          <Formik
            initialValues={{
              email: ''
            }}
            validationSchema={forgotPasswordSchema}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validateOnBlur={true}
          >
            {({ isSubmitting, errors, touched, setFieldValue, setFieldTouched, values }) => (
              <Form>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Error Message */}
                  {status?.apiError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {status.apiError}
                    </Alert>
                  )}

                  {/* Instructions */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Enter your email address and we'll send you a link to reset your password.
                  </Typography>

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
                    fullWidth
                  />

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
                      {loadingAction === 'forgot' ? (
                        <CircularProgress size={25} color="inherit" />
                      ) : 'Send Reset Link'}
                    </Button>
                  </Box>
                </Box>
              </Form>
            )}
          </Formik>
        ) : (
          /* Success State */
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
            </Alert>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Didn't receive the email? Check your spam folder or click below to resend.
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                type="button"
                variant="outlined"
                onClick={handleResend}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: '120px'
                }}
              >
                Try Again
              </Button>

              <Button
                type="button"
                variant="contained"
                onClick={() => navigate('/auth/login')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: '120px'
                }}
              >
                Go to Login
              </Button>
            </Box>
          </Box>
        )}

        {/* Back to Login Link */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Remember your password?{' '}
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

export default ForgotPassword;