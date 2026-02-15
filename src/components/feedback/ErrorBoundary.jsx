// components/feedback/ErrorBoundary.jsx
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Alert,
  Divider,
  Link,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ErrorOutline,
  Refresh,
  Home,
  Cached,
  BugReport,
  Email,
  WarningAmber,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components for animations
const PulsingIcon = styled(Box)(({ theme }) => ({
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      opacity: 0.8,
    },
    '50%': {
      transform: 'scale(1.1)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 0.8,
    },
  },
}));

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // Log to your error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to your API
      // fetch('/api/log-error', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     error: error.toString(), 
      //     errorInfo,
      //     url: window.location.href,
      //     userAgent: navigator.userAgent,
      //   }),
      // });
    }
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  handleReload = () => {
    window.location.reload();
  };

  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails,
    }));
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, showDetails } = this.state;

      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.50',
            p: 2,
          }}
        >
          <Container maxWidth="lg">
            <Paper
              elevation={3}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Decorative Header Gradient */}
              <Box
                sx={{
                  height: 8,
                  background: 'linear-gradient(90deg, #f44336 0%, #ff9800 50%, #f44336 100%)',
                }}
              />

              <Box sx={{ p: { xs: 3, sm: 5 } }}>
                {/* Icon and Title Section */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <PulsingIcon sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: '50%',
                        bgcolor: 'error.light',
                        color: 'error.seconadry',
                      }}
                    >
                      <WarningAmber sx={{ fontSize: { xs: 48, sm: 64 } }} />
                    </Box>
                  </PulsingIcon>

                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      background: 'linear-gradient(135deg, #f44336 0%, #ff9800 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Oops! Something Went Wrong
                  </Typography>

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}
                  >
                    We're sorry for the inconvenience. Our team has been notified and 
                    we're working to fix the issue as quickly as possible.
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  justifyContent="center"
                  sx={{ mb: 4 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Refresh />}
                    onClick={this.handleRetry}
                    sx={{
                      bgcolor: 'error.main',
                      '&:hover': { bgcolor: 'error.dark' },
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Try Again
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Home />}
                    onClick={this.handleGoHome}
                    sx={{
                      borderColor: 'grey.300',
                      color: 'text.primary',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.light',
                      },
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Go to Dashboard
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Cached />}
                    onClick={this.handleReload}
                    sx={{
                      borderColor: 'grey.300',
                      color: 'text.primary',
                      '&:hover': {
                        borderColor: 'success.main',
                        bgcolor: 'success.light',
                      },
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Reload Page
                  </Button>
                </Stack>

                {/* Quick Actions */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 3,
                    mb: 4,
                  }}
                >
                  <Tooltip title="Report this issue">
                    <IconButton
                      color="primary"
                      onClick={() => window.location.href = 'mailto:support@trakjobs.com?subject=Error Report'}
                    >
                      <Email />
                    </IconButton>
                  </Tooltip>

                  {process.env.NODE_ENV === 'development' && (
                    <Tooltip title="Toggle technical details">
                      <IconButton
                        color="info"
                        onClick={this.toggleDetails}
                      >
                        {showDetails ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                {/* Technical Details (Development Only) */}
                {process.env.NODE_ENV === 'development' && showDetails && error && (
                  <Box
                    sx={{
                      mt: 4,
                      pt: 4,
                      borderTop: '1px solid',
                      borderColor: 'grey.200',
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: 'warning.main',
                      }}
                    >
                      <BugReport fontSize="small" />
                      Technical Details (Development Mode)
                    </Typography>

                    <Alert severity="error" sx={{ mb: 2 }}>
                      <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
                        {error.toString()}
                      </Typography>
                    </Alert>

                    {errorInfo && (
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          bgcolor: 'grey.50',
                          maxHeight: 200,
                          overflow: 'auto',
                        }}
                      >
                        <Typography
                          variant="caption"
                          component="pre"
                          sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                            color: 'text.secondary',
                          }}
                        >
                          {errorInfo.componentStack}
                        </Typography>
                      </Paper>
                    )}
                  </Box>
                )}

                {/* Contact Support */}
                <Divider sx={{ my: 4 }}>
                  <Typography variant="caption" color="text.secondary">
                    Need Help?
                  </Typography>
                </Divider>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Still having issues? Contact our support team
                  </Typography>
                  <Link
                    href="mailto:support@trakjobs.com"
                    underline="hover"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      color: 'primary.main',
                      fontWeight: 500,
                    }}
                  >
                    <Email fontSize="small" />
                    support@trakjobs.com
                  </Link>
                </Box>

                {/* Error ID (Optional) */}
                {process.env.NODE_ENV === 'production' && (
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ display: 'block', textAlign: 'center', mt: 3 }}
                  >
                    Error ID: {Math.random().toString(36).substring(7).toUpperCase()}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;