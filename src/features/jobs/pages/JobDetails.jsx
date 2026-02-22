// src/pages/Jobs/JobDetails/index.jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, CircularProgress, Box, Typography, Button } from '@mui/material';
import { useToast } from '../../../components/common/ToastProvider';
import { useJobs } from '../../../features/jobs/hooks/useJobs';
import PageHeader from '../../../components/common/PageHeader';
import JobActionMenu from '../components/JobView/JobActionMenu';
import JobDetailsSection from '../components/JobView/JobDetailsSection';
import AttachmentsSection from '../components/JobView/AttachmentsSection';
import ActivitySection from '../components/JobView/ActivitySection';
import TasksSection from '../components/JobView/TasksSection';
import InstructionsSection from '../components/JobView/InstructionsSection';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { useState } from 'react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    currentJob,
    loading,
    getJob,
    deleteJob,
    changeJobStatus,
    addTask,
    toggleTask,
    deleteTask,
    addAttachment,
    deleteAttachment,
    clearCurrent,
  } = useJobs({ autoFetch: false });

  // Fetch job details
  useEffect(() => {
    if (id) {
      getJob(id);
    }

    return () => {
      clearCurrent();
    };
  }, [id, getJob, clearCurrent]);

  const handleEdit = () => {
    navigate(`/jobs/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await deleteJob(id);
      showToast('Job deleted successfully', 'success');
      navigate('/jobs');
    } catch (error) {
      // Error is already handled in the hook
    }
    setDeleteDialogOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Link copied to clipboard', 'info');
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await changeJobStatus(id, newStatus);
      showToast(`Job status updated to ${newStatus.replace('_', ' ')}`, 'success');
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      await addTask(id, taskData);
      // Toast is shown in hook
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleToggleTask = async (taskId) => {
    if (!currentJob?.tasks) return;
    
    const task = currentJob.tasks.find(t => t.id === taskId);
    if (task) {
      try {
        await toggleTask(id, taskId, task.completed);
      } catch (error) {
        // Error is already handled in the hook
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(id, taskId);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleAddGeneralAttachment = async (file) => {
    try {
      await addAttachment(id, file, file.name, { context: 'general' });
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleAddInstructionAttachment = async (file) => {
    try {
      await addAttachment(id, file, file.name, { context: 'instructions' });
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    if (!currentJob?.attachments_by_context) return;

    // Find which context the attachment belongs to
    let context = 'general';
    if (currentJob.attachments_by_context.instructions?.some(a => a.id === attachmentId)) {
      context = 'instructions';
    }

    try {
      await deleteAttachment(id, attachmentId, context);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleDownloadAttachment = (attachment) => {
    if (attachment?.url) {
      window.open(attachment.url, '_blank');
    }
  };

  const handlePreviewAttachment = (attachment) => {
    if (attachment?.url) {
      window.open(attachment.url, '_blank');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentJob) {
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
        title={currentJob.title}
        breadcrumb={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Jobs', path: '/jobs' },
          { label: currentJob.job_number, current: true }
        ]}
        action={
          <JobActionMenu
            status={currentJob.status}
            onEdit={handleEdit}
            onDelete={() => setDeleteDialogOpen(true)}
            onPrint={handlePrint}
            onShare={handleShare}
            onStatusChange={handleUpdateStatus}
          />
        }
      />

      <JobDetailsSection jobData={currentJob} />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <InstructionsSection
            instructions={currentJob.instructions}
            attachments={currentJob.attachments_by_context?.instructions || []}
            onAddAttachment={handleAddInstructionAttachment}
            onDeleteAttachment={handleDeleteAttachment}
            onDownload={handleDownloadAttachment}
            jobId={id}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TasksSection
            tasks={currentJob.tasks || []}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ActivitySection activities={currentJob.activities || []} />
        </Grid>
        <Grid item xs={12} md={6}>
          <AttachmentsSection
            attachments={currentJob.attachments_by_context?.general || []}
            onAddAttachment={() => document.getElementById('general-file-upload').click()}
            onDownload={handleDownloadAttachment}
            onPreview={handlePreviewAttachment}
            onDelete={handleDeleteAttachment}
          />
        </Grid>
      </Grid>

      <input
        type="file"
        id="general-file-upload"
        style={{ display: 'none' }}
        multiple
        onChange={(e) => {
          if (e.target.files?.length > 0) {
            Array.from(e.target.files).forEach(file => {
              handleAddGeneralAttachment(file);
            });
          }
        }}
      />

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