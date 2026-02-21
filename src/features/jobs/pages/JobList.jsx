// src/features/jobs/pages/JobList.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { Add } from '@mui/icons-material';
import { FileTextIcon, Filter } from 'lucide-react';
import JobTable from '../components/JobTable/JobTable';
import PageHeader from '../../../components/common/PageHeader';
import TableSkeleton from '../../../components/common/Loader/TableSkeleton';
import ErrorAlert from '../../../components/feedback/ErrorAlert';
import HeaderSearch from '../../../components/common/HeaderSearch';
import CustomButton from '../../../components/common/CustomButton';
import jobService from '../services/jobService';
import { useToast } from '../../../components/common/ToastProvider';

const JobList = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJobs, setSelectedJobs] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        perPage: 10
    });
    const [filters, setFilters] = useState({});

    const searchDebounceRef = useRef(null);

    // Fetch jobs
    const fetchJobs = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await jobService.getJobs({
                page: pagination.currentPage,
                per_page: pagination.perPage,
                search: searchTerm || undefined,
                ...filters,
                ...params
            });

            setJobs(response.data.data || []);
            setPagination({
                currentPage: response.data.meta?.current_page || 1,
                totalPages: response.data.meta?.last_page || 1,
                totalItems: response.data.meta?.total || 0,
                perPage: response.data.meta?.per_page || 10
            });
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setError('Failed to load jobs. Please try again.');
            showToast('Failed to load jobs', 'error');
        } finally {
            setLoading(false);
        }
    }, [pagination.currentPage, pagination.perPage, searchTerm, filters, showToast]);

    // Initial fetch
    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    // Handle search with debounce
    const handleSearchChange = useCallback((value) => {
        setSearchTerm(value);

        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }

        searchDebounceRef.current = setTimeout(() => {
            setPagination(prev => ({ ...prev, currentPage: 1 }));
            fetchJobs({ page: 1, search: value || undefined });
            setSelectedJobs([]);
            setSelectAll(false);
        }, 300);
    }, [fetchJobs]);

    // Handle page change
    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
        fetchJobs({ page });
        setSelectedJobs([]);
        setSelectAll(false);
    };

    // Handle rows per page change
    const handleRowsPerPageChange = (event) => {
        const newPerPage = parseInt(event.target.value, 10);
        setPagination(prev => ({ ...prev, perPage: newPerPage, currentPage: 1 }));
        fetchJobs({ per_page: newPerPage, page: 1 });
        setSelectedJobs([]);
        setSelectAll(false);
    };

    // Handle select all
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedJobs([]);
        } else {
            setSelectedJobs(jobs.map(job => job.id));
        }
        setSelectAll(!selectAll);
    };

    // Handle individual job selection
    const handleSelectJob = (jobId) => {
        if (selectedJobs.includes(jobId)) {
            setSelectedJobs(selectedJobs.filter(id => id !== jobId));
        } else {
            setSelectedJobs([...selectedJobs, jobId]);
        }
    };

    // Handle create job
    const handleCreateJob = () => {
        alert("Feature is not yet implemented")
        //navigate('/jobs/new');
    };

    // Handle create invoice for selected job
    const handleCreateInvoice = () => {
        if (selectedJobs.length === 1) {
            const selectedJob = jobs.find(job => job.id === selectedJobs[0]);
            if (selectedJob) {
                navigate('/invoices/new', {
                    state: {
                        job: {
                            id: selectedJob.id,
                            number: selectedJob.job_number,
                            title: selectedJob.title,
                            client: selectedJob.client,
                            amount: selectedJob.total_amount,
                            currency: selectedJob.currency
                        }
                    }
                });
            }
        } else if (selectedJobs.length > 1) {
            showToast('Please select only one job to create an invoice.', 'warning');
        }
    };

    // Handle filter
    const handleFilter = () => {
        // Implement filter modal or drawer
        console.log('Open filters');
    };

    // Update selectAll when jobs change
    useEffect(() => {
        if (jobs.length > 0 && selectedJobs.length === jobs.length) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [jobs, selectedJobs]);

    // Cleanup debounce
    useEffect(() => {
        return () => {
            if (searchDebounceRef.current) {
                clearTimeout(searchDebounceRef.current);
            }
        };
    }, []);

    return (
        <div className="min-h-full bg-gray-50">
            <PageHeader
                breadcrumb={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Jobs', current: true }
                ]}
                title="Jobs"
                subtitle="Manage and track all work orders in one place."
                actions={
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <HeaderSearch
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search jobs by number or title..."
                        />
                        {/* <CustomButton
                            label="Create Invoice"
                            onClick={handleCreateInvoice}
                            icon={FileTextIcon}
                            disabled={selectedJobs.length !== 1}
                            iconProps={{ size: 18 }}
                            sx={{ textTransform: 'none' }}
                        /> */}
                        <CustomButton
                            label="New Job"
                            onClick={handleCreateJob}
                            icon={Add}
                            sx={{ textTransform: 'none' }}
                        />
                    </Box>
                }
            />

            {error && (
                <ErrorAlert
                    message={error}
                    onRetry={() => fetchJobs()}
                    onClose={() => setError(null)}
                    className="mb-6"
                />
            )}

            <div className="bg-white rounded-lg mt-6">
                {loading ? (
                    <TableSkeleton
                        rows={6}
                        columns={6}
                        hasCheckbox={true}
                        hasAvatar={true}
                        hasStatus={true}
                    />
                ) : (
                    <JobTable
                        jobs={jobs}
                        selectedJobs={selectedJobs}
                        onSelectJob={handleSelectJob}
                        onSelectAll={handleSelectAll}
                        selectAll={selectAll}
                        onPageChange={handlePageChange}
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalItems}
                        itemsPerPage={pagination.perPage}
                        showPagination={true}
                    />
                )}
            </div>
        </div>
    );
};

export default JobList;