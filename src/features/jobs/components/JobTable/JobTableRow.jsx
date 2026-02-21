// src/features/jobs/components/JobTable/JobTableRow.jsx
import React from 'react';
import { TableRow, TableCell, Checkbox, Typography, Box, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import EllipsisText from '../../../../components/common/EllipsisText';
import ProfileAvatar from '../../../../components/common/avatar/ProfileAvatar';
import { Business, Person, Description, AttachFile, Assignment } from '@mui/icons-material';
import { BriefcaseBusiness, Home, Calendar, Clock, DollarSign } from 'lucide-react';

// Helper function to get priority chip color
const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
        case 'high':
        case 'urgent':
            return { bgcolor: '#ffebee', color: '#d32f2f' };
        case 'medium':
            return { bgcolor: '#fff4e5', color: '#ed6c02' };
        case 'low':
            return { bgcolor: '#e8f5e9', color: '#2e7d32' };
        default:
            return { bgcolor: '#f5f5f5', color: '#616161' };
    }
};

// Helper function to get status chip color
const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'completed':
            return { bgcolor: '#e8f5e9', color: '#2e7d32' };
        case 'in_progress':
        case 'scheduled':
            return { bgcolor: '#e3f2fd', color: '#1976d2' };
        case 'pending':
            return { bgcolor: '#fff4e5', color: '#ed6c02' };
        case 'cancelled':
        case 'archived':
            return { bgcolor: '#ffebee', color: '#d32f2f' };
        case 'on_hold':
            return { bgcolor: '#f3e5f5', color: '#7b1fa2' };
        default:
            return { bgcolor: '#f5f5f5', color: '#616161' };
    }
};

// Helper function to format work type
const formatWorkType = (type) => {
    if (!type) return 'N/A';
    return type.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
};

// Helper function to get client display name
const getClientDisplayName = (client) => {
    if (!client) return 'N/A';
    return client.name || 'Unnamed Client';
};

const JobTableRow = ({ job, isSelected, onSelect }) => {
    const clientName = getClientDisplayName(job.client);
    const clientType = job.client?.client_type || 'commercial';
    const jobNumber = job.job_number || 'N/A';
    const title = job.title || 'Untitled Job';
    const workType = formatWorkType(job.work_type);
    const priority = job.priority || 'medium';
    const status = job.status || 'pending';
    const startDate = job.start_date || 'Not set';
    const totalAmount = job.total_amount || 0;
    const formattedTotal = job.formatted_total || `$${totalAmount.toFixed(2)}`;
    const assignedTo = job.assigned_to;
    const taskCount = job.stats?.total_tasks || 0;
    const attachmentCount = job.stats?.total_attachments || 0;

    return (
        <TableRow hover selected={isSelected}>
            <TableCell padding="checkbox">
                <Checkbox size="small" checked={isSelected} onChange={() => onSelect(job.id)} />
            </TableCell>

            {/* Job Number & Title Column */}
            <TableCell>
                <Link to={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Assignment
                            sx={{
                                fontSize: 20,
                                color: clientType === 'commercial'
                                    ? 'primary.main'
                                    : 'warning.main',
                            }}
                        />
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                                {jobNumber}
                            </Typography>
                            <EllipsisText
                                text={title}
                                sx={{ fontSize: '0.75rem', color: 'text.secondary', maxWidth: 200 }}
                            />
                        </Box>
                    </Box>
                </Link>
            </TableCell>

            {/* Client Column */}
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {clientType === 'commercial' ? (
                        <BriefcaseBusiness size={18} color="#1976d2" />
                    ) : (
                        <Home size={18} color="#ed6c02" />
                    )}
                    <Box>
                        <EllipsisText
                            text={clientName}
                            sx={{ fontSize: '0.9rem', fontWeight: 500, maxWidth: 180 }}
                        />
                    </Box>
                </Box>
            </TableCell>

            {/* Work Type & Schedule Column */}
            <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Chip
                        label={workType}
                        size="small"
                        sx={{
                            bgcolor: '#f3f4f6',
                            color: '#374151',
                            height: 20,
                            width: 'fit-content',
                            '& .MuiChip-label': {
                                fontSize: '0.7rem',
                                px: 0.8,
                            },
                        }}
                    />
                </Box>
            </TableCell>

            {/* Priority & Status Column */}
            <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Chip
                        label={status.replace('_', ' ')}
                        size="small"
                        sx={{
                            ...getStatusColor(status),
                            height: 20,
                            width: 'fit-content',
                            '& .MuiChip-label': {
                                fontSize: '0.7rem',
                                px: 0.8,
                                fontWeight: 500,
                                textTransform: 'capitalize',
                            },
                        }}
                    />
                </Box>
            </TableCell>

            {/* Assigned To Column */}
            <TableCell>
                {assignedTo ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ProfileAvatar
                            name={assignedTo.full_name || 'Unknown User'}
                            size={24}
                        />
                        <EllipsisText
                            text={assignedTo.full_name || 'N/A'}
                            sx={{ fontSize: '0.85rem', maxWidth: 120 }}
                        />
                    </Box>
                ) : (
                    <Typography variant="body2" color="text.disabled">Unassigned</Typography>
                )}
            </TableCell>

            {/* Tasks & Attachments Column */}
            <TableCell>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Description fontSize="small" color="action" sx={{ fontSize: 16 }} />
                        <Typography variant="caption" color="text.secondary">
                            {taskCount}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AttachFile fontSize="small" color="action" sx={{ fontSize: 16 }} />
                        <Typography variant="caption" color="text.secondary">
                            {attachmentCount}
                        </Typography>
                    </Box>
                </Box>
            </TableCell>

            {/* Amount Column */}
            <TableCell align="right">
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                    {formattedTotal}
                </Typography>
            </TableCell>
        </TableRow>
    );
};

export default JobTableRow;