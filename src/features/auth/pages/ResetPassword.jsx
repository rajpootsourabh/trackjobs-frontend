import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
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
import PasswordField from '../../../components/common/form/PasswordField';
import { resetPasswordSchema } from '../schemas/validationSchemas';
import { resetPassword } from '../services';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loadingAction, setLoadingAction] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [status, setStatus] = useState({});
  const [tokenError, setTokenError] = useState('');

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  useEffect(() => {
    if (!token || !email) {
      setTokenError('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, [token, email]);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setStatus({});
    setLoadingAction('reset');

    try {
      await resetPassword({
        email,
        token,
        ...values
      });

      setIsSubmitted(true);
      setSuccessMessage('Password reset successful! You can now login with your new password.');
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setStatus({ apiError: error.message || 'Failed to reset password. Please try again.' });
      }
    } finally {
      setLoadingAction(null);
      setSubmitting(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/auth/login', {
      state: { message: 'Password reset successful! Please login with your new password.' }
    });
  };

  return (
    <AuthLayout title="RESET PASSWORD">
      <Paper
        elevation={0}
        sx={{
          p: 1,
          maxWidth: 450,
          mx: 'auto',
        }}
      >
        {/* Token Error State */}
        {tokenError ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {tokenError}
            </Alert>

            <Button
              type="button"
              variant="contained"
              onClick={() => navigate('/auth/forgot-password')}
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
              Request New Reset Link
            </Button>
          </Box>
        ) : !isSubmitted ? (
          <Formik
            initialValues={{
              password: '',
              password_confirmation: ''
            }}
            validationSchema={resetPasswordSchema}
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

                  {/* Email Info */}
                  <Alert severity="info" sx={{ mb: 1 }}>
                    Resetting password for: <strong>{email}</strong>
                  </Alert>

                  {/* New Password Field */}
                  <PasswordField
                    name="password"
                    label="New Password"
                    placeholder="Enter new password"
                    value={values.password}
                    onChange={(e) => setFieldValue('password', e.target.value)}
                    onBlur={() => setFieldTouched('password', true)}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    required
                    size="medium"
                    fullWidth
                  />

                  {/* Confirm Password Field */}
                  <PasswordField
                    name="password_confirmation"
                    label="Confirm New Password"
                    placeholder="Confirm your new password"
                    value={values.password_confirmation}
                    onChange={(e) => setFieldValue('password_confirmation', e.target.value)}
                    onBlur={() => setFieldTouched('password_confirmation', true)}
                    error={touched.password_confirmation && Boolean(errors.password_confirmation)}
                    helperText={touched.password_confirmation && errors.password_confirmation}
                    required
                    size="medium"
                    fullWidth
                  />

                  {/* Password Requirements */}
                  <Box sx={{ mt: -1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Password must contain:
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 1 }}>
                      • At least 8 characters
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 1 }}>
                      • One uppercase letter
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 1 }}>
                      • One lowercase letter
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 1 }}>
                      • One number
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 1 }}>
                      • One special character (@$!%*?&)
                    </Typography>
                  </Box>

                  {/* Form Actions */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                    {/* <Button
                      type="button"
                      variant="outlined"
                      onClick={() => navigate('/auth/login')}
                      disabled={isSubmitting || loadingAction !== null}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        minWidth: '100px'
                      }}
                    >
                      Cancel
                    </Button> */}

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
                      {loadingAction === 'reset' ? (
                        <CircularProgress size={25} color="inherit" />
                      ) : 'Reset Password'}
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
              You can now login with your new password.
            </Typography>

            <Button
              type="button"
              variant="contained"
              onClick={handleGoToLogin}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                minWidth: '150px'
              }}
            >
              Go to Login
            </Button>
          </Box>
        )}

        {/* Back to Login Link */}
        {!isSubmitted && !tokenError && (
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
        )}
      </Paper>
    </AuthLayout>
  );
};

export default ResetPassword;