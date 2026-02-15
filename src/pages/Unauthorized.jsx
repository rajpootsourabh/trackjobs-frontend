// pages/Unauthorized.jsx (Minimalist Version)
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Box, Typography, Container } from '@mui/material';
import { Lock } from '@mui/icons-material';

const Unauthorized = () => {
    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    textAlign: 'center',
                    p: 3,
                }}
            >
                <Lock
                    sx={{
                        fontSize: { xs: 80, sm: 100 },
                        color: 'error.main',
                        mb: 2,
                        opacity: 0.9,
                    }}
                />

                <Typography
                    variant="h1"
                    sx={{
                        fontSize: { xs: '6rem', sm: '8rem' },
                        fontWeight: 700,
                        color: 'error.main',
                        mb: 2,
                    }}
                >
                    403
                </Typography>

                <Typography
                    variant="h4"
                    sx={{
                        mb: 3,
                        fontWeight: 600,
                    }}
                >
                    Access Forbidden
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        mb: 4,
                        maxWidth: 600,
                    }}
                >
                    Sorry, you don't have permission to access this page.
                    Please contact your administrator if you need access.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Button
                        component={Link}
                        to="/dashboard"
                        variant="contained"
                        size="large"
                    >
                        Go to Dashboard
                    </Button>

                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => window.history.back()}
                    >
                        Go Back
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Unauthorized;