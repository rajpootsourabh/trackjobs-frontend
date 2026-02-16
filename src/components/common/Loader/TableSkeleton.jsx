// components/common/Loader/TableSkeleton.jsx
import React from 'react';
import { Paper, Table, TableBody, TableCell, TableRow, Box, Skeleton } from '@mui/material';

const TableSkeleton = ({ 
    rows = 5, 
    columns = 7,
    hasCheckbox = true
}) => {
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
                    {/* Table Header Skeleton */}
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                            {hasCheckbox && (
                                <TableCell padding="checkbox" sx={{ pl: 2, pr: 1 }}>
                                    <Skeleton 
                                        variant="rectangular" 
                                        width={18} 
                                        height={18} 
                                        sx={{ borderRadius: 0.5, bgcolor: '#e0e0e0', ml: 0.5 }} 
                                    />
                                </TableCell>
                            )}
                            {Array.from({ length: columns }).map((_, index) => (
                                <TableCell key={index}>
                                    <Skeleton 
                                        variant="text" 
                                        width={index === 0 ? 100 : index === 1 ? 120 : 80} 
                                        height={20} 
                                        sx={{ bgcolor: '#e0e0e0' }} 
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    {/* Table Body Skeleton */}
                    <TableBody>
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {hasCheckbox && (
                                    <TableCell padding="checkbox" sx={{ pl: 2, pr: 1 }}>
                                        <Skeleton 
                                            variant="rectangular" 
                                            width={18} 
                                            height={18} 
                                            sx={{ borderRadius: 0.5, bgcolor: '#f0f0f0', ml: 0.5 }} 
                                        />
                                    </TableCell>
                                )}
                                {Array.from({ length: columns }).map((_, colIndex) => (
                                    <TableCell key={colIndex}>
                                        <Skeleton 
                                            variant="text" 
                                            width={colIndex === 0 ? 140 : colIndex === 1 ? 120 : 100} 
                                            height={20} 
                                            sx={{ bgcolor: '#f0f0f0' }} 
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination Skeleton */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        alignItems: 'center',
                        p: 2,
                        borderTop: '1px solid',
                        borderColor: '#e5e7eb',
                        backgroundColor: '#fff'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Skeleton variant="text" width={100} height={20} sx={{ bgcolor: '#f0f0f0' }} />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Skeleton variant="circular" width={32} height={32} sx={{ bgcolor: '#f0f0f0' }} />
                            <Skeleton variant="circular" width={32} height={32} sx={{ bgcolor: '#f0f0f0' }} />
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

// Simple TableHead component
const TableHead = ({ children }) => (
    <thead style={{ 
        backgroundColor: '#f9fafb',
        borderBottom: '1px solid #e5e7eb'
    }}>
        {children}
    </thead>
);

export default TableSkeleton;