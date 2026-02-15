// pages/NotYetDesigned.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import {
  Construction as ConstructionIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon
} from '@mui/icons-material';

const NotYetDesigned = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            textAlign: 'center',
            width: '100%',
            background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`
          }}
        >
          {/* Construction Icon with animated background */}
          <Box
            sx={{
              position: 'relative',
              display: 'inline-flex',
              mb: 3
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: -20,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(theme.palette.warning.main, 0.2)} 0%, transparent 70%)`,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(0.95)', opacity: 0.5 },
                  '50%': { transform: 'scale(1.05)', opacity: 0.8 },
                  '100%': { transform: 'scale(0.95)', opacity: 0.5 }
                }
              }}
            />
            <ConstructionIcon
              sx={{
                fontSize: 80,
                color: theme.palette.warning.main,
                position: 'relative',
                transform: 'rotate(0deg)',
                animation: 'wiggle 3s infinite',
                '@keyframes wiggle': {
                  '0%, 100%': { transform: 'rotate(0deg)' },
                  '25%': { transform: 'rotate(-5deg)' },
                  '75%': { transform: 'rotate(5deg)' }
                }
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              display: 'inline-block'
            }}
          >
            Under Construction
          </Typography>

          {/* Description */}
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}
          >
            This page is currently being designed and will be available soon.
            We're working hard to bring you something amazing!
          </Typography>

          {/* Progress Indicator */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
              mb: 4
            }}
          >
            {[1, 2, 3].map((item) => (
              <Box
                key={item}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: theme.palette.primary.main,
                  opacity: 0.3,
                  animation: `pulse 1.5s infinite ${item * 0.2}s`,
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                    '50%': { opacity: 1, transform: 'scale(1.2)' }
                  }
                }}
              />
            ))}
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 4,
                py: 1.5
              }}
            >
              Go Back
            </Button>

            <Button
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 4,
                py: 1.5,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                }
              }}
            >
              Go to Dashboard
            </Button>
          </Box>

          {/* Decorative Elements */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 4,
              mt: 4,
              color: theme.palette.text.disabled
            }}
          >
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }} />
              Coming Soon
            </Typography>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }} />
              Work in Progress
            </Typography>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }} />
              Stay Tuned
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotYetDesigned;