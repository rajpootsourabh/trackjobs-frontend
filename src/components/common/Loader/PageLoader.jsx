// components/common/Loader/PageLoader.jsx
import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const PageLoader = ({
    message = "Loading...",
    size = "lg",
    fullScreen = false,
    transparent = false
}) => {
    const sizeMap = {
        sm: { container: 'h-32', spinner: 32, text: 'text-sm' },
        md: { container: 'h-48', spinner: 40, text: 'text-base' },
        lg: { container: 'h-64', spinner: 48, text: 'text-lg' },
        xl: { container: 'h-96', spinner: 56, text: 'text-xl' },
    };

    const selectedSize = sizeMap[size] || sizeMap.lg;

    // If fullScreen, use viewport height, otherwise use the specified height
    const containerHeight = fullScreen ? '80vh' : selectedSize.container;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: containerHeight,
                width: '100%',
                backgroundColor: transparent ? 'transparent' : '#f9fafb',
            }}
        >
            <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    {/* Outer ring */}
                    <CircularProgress
                        size={selectedSize.spinner}
                        thickness={4}
                        sx={{
                            color: '#e5e7eb',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                        }}
                        variant="determinate"
                        value={100}
                    />
                    {/* Inner spinning ring */}
                    <CircularProgress
                        size={selectedSize.spinner}
                        thickness={4}
                        sx={{
                            color: '#3574BB',
                            animationDuration: '1s',
                            '& .MuiCircularProgress-circle': {
                                strokeLinecap: 'round',
                            },
                        }}
                    />
                </Box>
                <Typography
                    variant="body1"
                    sx={{
                        mt: 2,
                        color: '#6b7280',
                        fontWeight: 500,
                        fontSize: selectedSize.text,
                        letterSpacing: '0.025em',
                    }}
                >
                    {message}
                </Typography>
            </Box>
        </Box>
    );
};

export default PageLoader;