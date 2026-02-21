// src/services/api/jobService.js
import apiClient from '../../../services/api/httpClient'; // Make sure this path is correct

const jobService = {
    // Get all jobs with filters
    getJobs: (params = {}) => {
        return apiClient.get('api/v1/vendors/jobs', { params }); // Remove /api/v1 if it's in baseURL
    },

    // Get single job by ID
    getJobById: (id) => {
        return apiClient.get(`api/v1/vendors/jobs/${id}`);
    },

    // Get job by number
    getJobByNumber: (jobNumber) => {
        return apiClient.get(`api/v1/vendors/jobs/number/${jobNumber}`);
    },

    // Create new job
    createJob: (data) => {
        return apiClient.post('api/v1/vendors/jobs', data);
    },

    // Update job
    updateJob: (id, data) => {
        return apiClient.put(`api/v1/vendors/jobs/${id}`, data);
    },

    // Update job status
    updateJobStatus: (id, status) => {
        return apiClient.patch(`api/v1/vendors/jobs/${id}/status`, { status });
    },

    // Delete job
    deleteJob: (id) => {
        return apiClient.delete(`api/v1/vendors/jobs/${id}`);
    },

    // Task management
    addTask: (jobId, taskData) => {
        return apiClient.post(`api/v1/vendors/jobs/${jobId}/tasks`, taskData);
    },

    toggleTask: (jobId, taskId) => {
        return apiClient.patch(`api/v1/vendors/jobs/${jobId}/tasks/${taskId}/toggle`);
    },

    deleteTask: (jobId, taskId) => {
        return apiClient.delete(`api/v1/vendors/jobs/${jobId}/tasks/${taskId}`);
    },

    // Attachment management
    addAttachment: (jobId, file, fileName) => {
        const formData = new FormData();
        formData.append('file', file);
        if (fileName) {
            formData.append('file_name', fileName);
        }
        return apiClient.post(`api/v1/vendors/jobs/${jobId}/attachments`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    deleteAttachment: (jobId, attachmentId) => {
        return apiClient.delete(`api/v1/vendors/jobs/${jobId}/attachments/${attachmentId}`);
    },

    // Get statistics
    getStatistics: () => {
        return apiClient.get('api/v1/vendors/jobs/statistics');
    },
};

export default jobService;