// src/services/api/jobService.js
import apiClient, { fileUploadClient } from "../../../services/api/httpClient"; // Make sure this path is correct
import uploadClient from "../../../services/api/uploadClient";

const jobService = {
  // Get all jobs with filters
  getJobs: (params = {}) => {
    return apiClient.get("api/v1/vendors/jobs", { params }); // Remove /api/v1 if it's in baseURL
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
    return apiClient.post("api/v1/vendors/jobs", data);
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
    return apiClient.patch(
      `api/v1/vendors/jobs/${jobId}/tasks/${taskId}/toggle`,
    );
  },

  deleteTask: (jobId, taskId) => {
    return apiClient.delete(`api/v1/vendors/jobs/${jobId}/tasks/${taskId}`);
  },

  // Attachment management
  addAttachment: (jobId, file, fileName, options = {}) => {
    const formData = new FormData();
    formData.append("file", file);

    // Add context if provided
    if (options.context) {
      formData.append("context", options.context);
      console.log("✅ Adding context to formData:", options.context);
    }

    if (fileName) {
      formData.append("file_name", fileName);
    }

    // Log FormData contents for debugging
    console.log("📦 FormData entries:");
    for (let pair of formData.entries()) {
      console.log(
        `   ${pair[0]}: ${pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]}`,
      );
    }

    return uploadClient.post(
      `api/v1/vendors/jobs/${jobId}/attachments`,
      formData,
    );
  },
  deleteAttachment: (jobId, attachmentId) => {
    return apiClient.delete(
      `api/v1/vendors/jobs/${jobId}/attachments/${attachmentId}`,
    );
  },

  // Get statistics
  getStatistics: () => {
    return apiClient.get("api/v1/vendors/jobs/statistics");
  },
};

export default jobService;
