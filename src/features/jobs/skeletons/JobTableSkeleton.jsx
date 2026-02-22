import React from 'react';
import { Paper, Table, TableHead, TableBody, TableCell, TableRow, Box, Skeleton } from '@mui/material';
import JobTablePaginationSkeleton from './JobTablePaginationSkeleton';


const JobTableSkeleton = ({
    rows = 5,
    showPagination = false,
    totalItems = 0,
    currentPage = 1,
    itemsPerPage = 5,
    onPageChange,
    onRowsPerPageChange,
}) => {
    // Convert to 0-based index for Material-UI pagination
    const pageIndex = currentPage - 1;

    // Ensure pagination shows multiple pages even when totalItems is small
    // This makes the skeleton always show a consistent look with multiple pages
    const paginationTotalItems = Math.max(totalItems, rows * 10); // At least 50 items for 5 rows

    const handlePageChange = (event, newPage) => {
        if (onPageChange) {
            onPageChange(newPage + 1);
        }
    };

    const handleRowsPerPageChange = (event) => {
        if (onRowsPerPageChange) {
            onRowsPerPageChange(event);
        }
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
                }}
            >
                <Table>
                    {/* Table Head - exactly matching body row styling */}
                    <TableHead>
                        <TableRow
                            sx={{
                                backgroundColor: '#f9fafb',
                                '& .MuiTableCell-root': {
                                    borderBottom: '1px solid',
                                    borderColor: '#e5e7eb',
                                }
                            }}
                        >
                            <TableCell padding="checkbox" sx={{ width: 58 }}>
                                <Skeleton
                                    variant="rectangular"
                                    width={20}
                                    height={20}
                                    sx={{ borderRadius: 0.5, mx: 'auto' }}
                                />
                            </TableCell>
                            <TableCell sx={{ width: 220 }}><Skeleton variant="text" width="90%" height={24} /></TableCell>
                            <TableCell sx={{ width: 180 }}><Skeleton variant="text" width="90%" height={24} /></TableCell>
                            <TableCell sx={{ width: 100 }}><Skeleton variant="text" width="90%" height={24} /></TableCell>
                            <TableCell sx={{ width: 160 }}><Skeleton variant="text" width="90%" height={24} /></TableCell>
                            <TableCell sx={{ width: 140 }}><Skeleton variant="text" width="90%" height={24} /></TableCell>
                            <TableCell align="right" sx={{ width: 120 }}><Skeleton variant="text" width="70%" height={24} sx={{ ml: 'auto' }} /></TableCell>
                        </TableRow>
                    </TableHead>

                    {/* Table Body - Always shows exactly 'rows' number of skeleton rows */}
                    <TableBody>
                        {Array.from({ length: rows }).map((_, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    height: '73px',
                                }}
                            >
                                <TableCell padding="checkbox" sx={{ width: 58, py: '16px' }}>
                                    <Skeleton
                                        variant="rectangular"
                                        width={20}
                                        height={20}
                                        sx={{ borderRadius: 0.5, mx: 'auto' }}
                                    />
                                </TableCell>
                                <TableCell sx={{ width: 220, py: '16px' }}><Skeleton variant="text" width="90%" height={24} /></TableCell>
                                <TableCell sx={{ width: 180, py: '16px' }}><Skeleton variant="text" width="90%" height={24} /></TableCell>
                                <TableCell sx={{ width: 100, py: '16px' }}><Skeleton variant="text" width="90%" height={24} /></TableCell>
                                <TableCell sx={{ width: 160, py: '16px' }}><Skeleton variant="text" width="90%" height={24} /></TableCell>
                                <TableCell sx={{ width: 140, py: '16px' }}><Skeleton variant="text" width="90%" height={24} /></TableCell>
                                <TableCell align="right" sx={{ width: 120, py: '16px' }}><Skeleton variant="text" width="70%" height={24} sx={{ ml: 'auto' }} /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {showPagination && (
                    <JobTablePaginationSkeleton />
                )}
            </Paper>
        </Box>
    );
};

export default JobTableSkeleton;