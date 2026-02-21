import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import {
    Box,
    Grid,
    Typography,
    Paper,
    Button,
    MenuItem,
    TextField
} from '@mui/material';

const steps = [
    '1. Select Service',
    '2. Choose Date',
    '3. Select Time',
    '4. Add Details',
    '5. Pay & Confirm'
];

const BookingForm = ({ onSubmit }) => {
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep((prev) => prev + 1);
        }
    };

    return (
        <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh', py: 6 }}>
            {/* Page Title */}
            <Typography
                align="center"
                variant="h5"
                fontWeight={600}
                mb={4}
            >
                Online Booking Form
            </Typography>

            {/* Main Rounded Container */}
            <Paper
                sx={{
                    maxWidth: 1200,
                    mx: 'auto',
                    p: 4,
                    borderRadius: 4,
                    // boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
                }}
            >
                {/* Step Pills */}
                {/* Step Header Container */}
                <Box
                    sx={{
                        // bgcolor: '#f3f4f6',
                        p: 0,
                        borderRadius: '28px',
                        border: '1px solid #e5e7eb',
                        mb: 4
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#e5e7eb',
                            borderRadius: '999px',
                            padding: '4px',
                            overflow: 'hidden'
                        }}
                    >
                        {steps.map((label, index) => {
                            const isActive = index === activeStep;

                            return (
                                <Box
                                    key={index}
                                    onClick={() => setActiveStep(index)}
                                    sx={{
                                        flex: 1,
                                        textAlign: 'center',
                                        padding: '10px 0',
                                        borderRadius: '999px',
                                        backgroundColor: isActive ? '#3b82f6' : 'transparent',
                                        color: isActive ? '#ffffff' : '#6b7280',
                                        fontWeight: 500,
                                        fontSize: '15px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        zIndex: isActive ? 2 : 1,
                                        '&:hover': {
                                            backgroundColor: isActive ? '#3b82f6' : '#d1d5db'
                                        }
                                    }}
                                >
                                    {label}
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                <Formik
                    initialValues={{
                        service_category: '',
                        service_provider: '',
                        location:
                            'Lower Manhattan, New York, NY 10003, USA'
                    }}
                    onSubmit={onSubmit}
                >
                    {({ values, handleChange }) => (
                        <Form>
                            <Grid container spacing={4}>
                                {/* Left Map Section */}
                                <Grid item xs={12} md={7}>
                                    <Box
                                        sx={{
                                            height: 500,
                                            borderRadius: 3,
                                            overflow: 'hidden',
                                            backgroundImage:
                                                'url("https://maps.googleapis.com/maps/api/staticmap?center=Lower+Manhattan,New+York&zoom=14&size=600x500")',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    />
                                </Grid>

                                {/* Right Form Section */}
                                <Grid item xs={12} md={5}>
                                    <Typography
                                        variant="h6"
                                        fontWeight={600}
                                        mb={1}
                                    >
                                        Service Selection
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        mb={3}
                                    >
                                        Select a Service
                                    </Typography>

                                    {/* Category */}
                                    <TextField
                                        select
                                        fullWidth
                                        name="service_category"
                                        label="Choose Service Category *"
                                        value={values.service_category}
                                        onChange={handleChange}
                                        sx={{ mb: 3 }}
                                    >
                                        <MenuItem value="">Select</MenuItem>
                                        <MenuItem value="cleaning">
                                            Cleaning
                                        </MenuItem>
                                        <MenuItem value="plumbing">
                                            Plumbing
                                        </MenuItem>
                                        <MenuItem value="electrical">
                                            Electrical
                                        </MenuItem>
                                    </TextField>

                                    {/* Provider */}
                                    <TextField
                                        select
                                        fullWidth
                                        name="service_provider"
                                        label="Select Service Provider *"
                                        value={values.service_provider}
                                        onChange={handleChange}
                                        sx={{ mb: 3 }}
                                    >
                                        <MenuItem value="">Select</MenuItem>
                                        <MenuItem value="john">
                                            John Smith
                                        </MenuItem>
                                        <MenuItem value="sarah">
                                            Sarah Johnson
                                        </MenuItem>
                                    </TextField>

                                    {/* Location */}
                                    <TextField
                                        select
                                        fullWidth
                                        name="location"
                                        label="Select Location *"
                                        value={values.location}
                                        onChange={handleChange}
                                        sx={{ mb: 4 }}
                                    >
                                        <MenuItem value="Lower Manhattan, New York, NY 10003, USA">
                                            Lower Manhattan, New York, NY 10003, USA
                                        </MenuItem>
                                        <MenuItem value="2nd Street Dorm I E 2nd St, New York, NY 10003, USA">
                                            2nd Street Dorm I E 2nd St, New York, NY 10003, USA
                                        </MenuItem>
                                    </TextField>

                                    {/* Next Button Centered */}
                                    <Box textAlign="center">
                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            sx={{
                                                px: 5,
                                                py: 1.2,
                                                borderRadius: 2,
                                                bgcolor: '#3f6ad8',
                                                textTransform: 'none',
                                                fontWeight: 500
                                            }}
                                        >
                                            Next
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Box>
    );
};

export default BookingForm;