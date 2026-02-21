// src/pages/Jobs/JobDetails/index.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, CircularProgress, Box, Typography, Button } from '@mui/material';
import { useToast } from '../../../components/common/ToastProvider';
import PageHeader from '../../../components/common/PageHeader';
import JobActionMenu from '../components/JobView/JobActionMenu';
import JobDetailsSection from '../components/JobView/JobDetailsSection';
import AttachmentsSection from '../components/JobView/AttachmentsSection';
import ActivitySection from '../components/JobView/ActivitySection';
import TasksSection from '../components/JobView/TasksSection';
import InstructionsSection from '../components/JobView/InstructionsSection';
import jobService from '../services/jobService';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [jobData, setJobData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    
    // Use ref to track if component is mounted
    const isMounted = useRef(true);
    
    // Use ref to prevent duplicate fetches
    const fetchedRef = useRef(false);

    // Memoize fetch function to prevent recreation
    const fetchJobDetails = useCallback(async () => {
        // Prevent duplicate fetches
        if (fetchedRef.current) return;
        
        try {
            setLoading(true);
            const response = await jobService.getJobById(id);
            
            if (isMounted.current) {
                setJobData(response.data.data);
                fetchedRef.current = true;
            }
        } catch (error) {
            console.error('Error fetching job details:', error);
            if (isMounted.current) {
                showToast('Failed to load job details', 'error');
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    }, [id, showToast]);

    useEffect(() => {
        // Set mounted flag
        isMounted.current = true;
        fetchedRef.current = false; // Reset when id changes
        
        fetchJobDetails();

        // Cleanup
        return () => {
            isMounted.current = false;
        };
    }, [fetchJobDetails]);

    // Rest of your handlers (memoized to prevent recreation)
    const handleEdit = useCallback(() => {
        navigate(`/jobs/${id}/edit`);
    }, [navigate, id]);

    const handleDelete = useCallback(async () => {
        try {
            await jobService.deleteJob(id);
            showToast('Job deleted successfully', 'success');
            navigate('/jobs');
        } catch (error) {
            console.error('Error deleting job:', error);
            showToast('Failed to delete job', 'error');
        }
        setDeleteDialogOpen(false);
    }, [id, navigate, showToast]);

    const handlePrint = useCallback(() => {
        window.print();
    }, []);

    const handleShare = useCallback(() => {
        navigator.clipboard?.writeText(window.location.href);
        showToast('Link copied to clipboard', 'info');
    }, [showToast]);

    const handleAddTask = useCallback(async (taskData) => {
        try {
            const response = await jobService.addTask(id, taskData);
            setJobData(prev => ({
                ...prev,
                tasks: [...(prev.tasks || []), response.data.data],
                stats: {
                    ...prev.stats,
                    total_tasks: (prev.stats?.total_tasks || 0) + 1,
                    pending_tasks: (prev.stats?.pending_tasks || 0) + 1,
                }
            }));
            showToast('Task added successfully', 'success');
        } catch (error) {
            console.error('Error adding task:', error);
            showToast('Failed to add task', 'error');
        }
    }, [id, showToast]);

    const handleToggleTask = useCallback(async (taskId) => {
        try {
            const response = await jobService.toggleTask(id, taskId);
            const updatedTask = response.data.data;
            
            setJobData(prev => ({
                ...prev,
                tasks: prev.tasks.map(task => 
                    task.id === taskId ? updatedTask : task
                ),
                stats: {
                    ...prev.stats,
                    completed_tasks: prev.tasks.filter(t => 
                        t.id === taskId ? updatedTask.completed : t.completed
                    ).length,
                }
            }));
        } catch (error) {
            console.error('Error toggling task:', error);
            showToast('Failed to update task', 'error');
        }
    }, [id, showToast]);

    const handleDeleteTask = useCallback(async (taskId) => {
        try {
            await jobService.deleteTask(id, taskId);
            setJobData(prev => ({
                ...prev,
                tasks: prev.tasks.filter(task => task.id !== taskId),
                stats: {
                    ...prev.stats,
                    total_tasks: prev.stats.total_tasks - 1,
                    pending_tasks: prev.tasks.find(t => t.id === taskId)?.completed 
                        ? prev.stats.pending_tasks 
                        : prev.stats.pending_tasks - 1,
                }
            }));
            showToast('Task deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting task:', error);
            showToast('Failed to delete task', 'error');
        }
    }, [id, showToast]);

    const handleAddAttachment = useCallback(async (file) => {
        try {
            const response = await jobService.addAttachment(id, file, file.name);
            const newAttachment = response.data.data;
            
            setJobData(prev => ({
                ...prev,
                attachments: [...(prev.attachments || []), newAttachment],
                stats: {
                    ...prev.stats,
                    total_attachments: (prev.stats?.total_attachments || 0) + 1,
                }
            }));
            showToast('File uploaded successfully', 'success');
        } catch (error) {
            console.error('Error uploading file:', error);
            showToast('Failed to upload file', 'error');
        }
    }, [id, showToast]);

    const handleDeleteAttachment = useCallback(async (attachmentId) => {
        try {
            await jobService.deleteAttachment(id, attachmentId);
            setJobData(prev => ({
                ...prev,
                attachments: prev.attachments.filter(att => att.id !== attachmentId),
                stats: {
                    ...prev.stats,
                    total_attachments: prev.stats.total_attachments - 1,
                }
            }));
            showToast('Attachment deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting attachment:', error);
            showToast('Failed to delete attachment', 'error');
        }
    }, [id, showToast]);

    const handleDownloadAttachment = useCallback((attachment) => {
        if (attachment?.url) {
            window.open(attachment.url, '_blank');
        }
    }, []);

    const handlePreviewAttachment = useCallback((attachment) => {
        if (attachment?.url) {
            window.open(attachment.url, '_blank');
        }
    }, []);

    const handleUpdateStatus = useCallback(async (newStatus) => {
        try {
            const response = await jobService.updateJobStatus(id, newStatus);
            setJobData(prev => ({
                ...prev,
                status: response.data.data.status
            }));
            showToast(`Job status updated to ${newStatus.replace('_', ' ')}`, 'success');
        } catch (error) {
            console.error('Error updating status:', error);
            showToast('Failed to update status', 'error');
        }
    }, [id, showToast]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!jobData) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Job not found</Typography>
                <Button variant="contained" onClick={() => navigate('/jobs')}>
                    Back to Jobs
                </Button>
            </Box>
        );
    }

    return (
        <>
            <PageHeader
                title={jobData.title}
                // subtitle={`Job ID: ${jobData.job_number}`}
                breadcrumb={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Jobs', path: '/jobs' },
                    { label: jobData.job_number, current: true }
                ]}
                action={
                    <JobActionMenu
                        status={jobData.status}
                        onEdit={handleEdit}
                        onDelete={() => setDeleteDialogOpen(true)}
                        onPrint={handlePrint}
                        onShare={handleShare}
                        onStatusChange={handleUpdateStatus}
                    />
                }
            />

            {/* First Row - Full Width Job Details */}
            <JobDetailsSection jobData={jobData} />

            {/* Second Row - Two Columns: Instruction & Notes | Tasks & Checklist */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                    <InstructionsSection
                        instructions={jobData.instructions}
                        notes={jobData.notes}
                        onAttachFiles={() => document.getElementById('file-upload').click()}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TasksSection
                        tasks={jobData.tasks || []}
                        onAddTask={handleAddTask}
                        onToggleTask={handleToggleTask}
                        onDeleteTask={handleDeleteTask}
                    />
                </Grid>
            </Grid>

            {/* Third Row - Two Columns: Activity | Attachments */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <ActivitySection activities={jobData.activities || []} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <AttachmentsSection
                        attachments={jobData.attachments || []}
                        onAddAttachment={() => document.getElementById('file-upload').click()}
                        onDownload={handleDownloadAttachment}
                        onPreview={handlePreviewAttachment}
                        onDelete={handleDeleteAttachment}
                    />
                </Grid>
            </Grid>

            {/* Hidden file input */}
            <input
                type="file"
                id="file-upload"
                style={{ display: 'none' }}
                onChange={(e) => {
                    if (e.target.files?.[0]) {
                        handleAddAttachment(e.target.files[0]);
                    }
                }}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteDialogOpen}
                title="Delete Job"
                message="Are you sure you want to delete this job? This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setDeleteDialogOpen(false)}
            />
        </>
    );
};

export default JobDetails;