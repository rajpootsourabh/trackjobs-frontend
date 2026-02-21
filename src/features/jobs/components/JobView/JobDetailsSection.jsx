// src/features/jobs/components/JobView/JobDetailsSection.jsx
import React from 'react';
import { Grid, Paper, Typography, Box, Chip, Button } from '@mui/material';
import { Business, Edit, Check, Schedule } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SectionHeader from '../../../../components/common/form/SectionHeader';

const JobDetailsSection = ({ jobData }) => {
    const navigate = useNavigate();

    // Safely access nested properties with fallbacks
    const clientName = jobData?.client?.business_name ||
        (jobData?.client?.first_name && jobData?.client?.last_name
            ? `${jobData.client.first_name} ${jobData.client.last_name}`
            : 'N/A');

    const clientId = jobData?.client?.id || 'N/A';

    // Format currency safely
    const totalAmount = jobData?.total_amount || 0;
    const formattedTotal = jobData?.currency
        ? `${jobData.currency} ${totalAmount.toFixed(2)}`
        : `$${totalAmount.toFixed(2)}`;

    return (
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            {/* Header with Title and Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <SectionHeader number="1" title="Job Details" />
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Schedule />}
                        onClick={() => console.log('Schedule job')}
                        sx={{
                            textTransform: 'none',
                            borderColor: 'primary.main',
                            color: 'primary.main',
                        }}
                    >
                        Schedule
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={1}>
                {/* Client - Full Width */}
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Client:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Business fontSize="small" color="primary" />
                            <Typography variant="body1">{clientName}</Typography>

                        </Box>
                    </Box>
                </Grid>

                {/* Row 1 */}
                <Grid item xs={12} md={4}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        height: '26px',
                        alignItems: 'center'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Job ID:
                            </Typography>
                            <Typography variant="body1">{jobData?.job_number || 'N/A'}</Typography>
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        height: '26px',
                        alignItems: 'center'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            width: '200px',
                            justifyContent: 'flex-start'
                        }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Issue Date:
                            </Typography>
                            <Typography variant="body1">{jobData?.issue_date || 'N/A'}</Typography>
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        height: '26px',
                        alignItems: 'center'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Total Amount:
                            </Typography>
                            <Typography variant="h6" fontWeight={600} color="text.secondary">
                                {formattedTotal}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Row 2 */}
                <Grid item xs={12} md={4}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        height: '26px',
                        alignItems: 'center'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Job Type:
                            </Typography>
                            <Typography variant="body1">
                                {jobData?.work_type
                                    ? jobData.work_type.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
                                    : 'N/A'}
                            </Typography>

                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        height: '26px',
                        alignItems: 'center'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            width: '200px',
                            justifyContent: 'flex-start'
                        }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Start Date:
                            </Typography>
                            <Typography variant="body1">{jobData?.start_date || 'N/A'}</Typography>
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        height: '26px',
                        alignItems: 'center'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                End Date:
                            </Typography>
                            <Typography variant="body1">{jobData?.end_date || 'N/A'}</Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Row 3 */}
                {jobData?.quote_id && (
                    <Grid item xs={12} md={4}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            height: '26px',
                            alignItems: 'center'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Created from:
                                </Typography>
                                <Chip
                                    label={`Quote #${jobData.quote_id}`}
                                    size="small"
                                    onClick={() => navigate(`/quotes/${jobData.quote_id}`)}
                                    sx={{
                                        cursor: 'pointer',
                                        '& .MuiChip-label': {
                                            fontSize: '0.8rem',
                                        },
                                    }}
                                />
                            </Box>
                        </Box>
                    </Grid>
                )}

                <Grid item xs={12} md={4}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        height: '26px',
                        alignItems: 'center'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Priority:
                            </Typography>
                            <Chip
                                label={jobData?.priority || 'N/A'}
                                size="small"
                                color={
                                    jobData?.priority === 'high' ? 'error' :
                                        jobData?.priority === 'medium' ? 'warning' :
                                            jobData?.priority === 'low' ? 'success' : 'default'
                                }
                                sx={{
                                    height: 20,
                                    '& .MuiChip-label': {
                                        fontSize: '0.65rem',
                                        px: 0.8,
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default JobDetailsSection;