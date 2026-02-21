// src/features/jobs/components/JobTable/JobTable.jsx
import React from 'react';
import { Paper, Table, TableBody, TableCell, TableRow, Box } from '@mui/material';
import JobTableHeader from './JobTableHeader';
import JobTableRow from './JobTableRow';
import JobTablePagination from './JobTablePagination';

const JobTable = ({
    jobs = [],
    selectedJobs = [],
    onSelectJob,
    onSelectAll,
    selectAll,
    onPageChange,
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    itemsPerPage = 10,
    showPagination = false
}) => {
    // Convert to 0-based index for Material-UI pagination
    const pageIndex = currentPage - 1;

    const handlePageChange = (event, newPage) => {
        onPageChange(newPage + 1);
    };

    const handleRowsPerPageChange = (event) => {
        // Handle rows per page change if needed
        console.log('Rows per page:', event.target.value);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: '#e5e7eb',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    backgroundColor: '#fff',
                    transition: 'box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    }
                }}
            >
                <Table>
                    <JobTableHeader selectAll={selectAll} onSelectAll={onSelectAll} />

                    <TableBody>
                        {jobs.map((job) => (
                            <JobTableRow
                                key={job.id}
                                job={job}
                                isSelected={selectedJobs.includes(job.id)}
                                onSelect={onSelectJob}
                            />
                        ))}

                        {jobs.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                    No jobs found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {showPagination && (
                    <JobTablePagination
                        count={totalItems}
                        page={pageIndex}
                        rowsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                    />
                )}
            </Paper>
        </Box>
    );
};

export default JobTable;