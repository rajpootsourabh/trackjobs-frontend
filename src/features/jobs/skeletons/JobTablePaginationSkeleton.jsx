// components/skeletons/JobTablePaginationSkeleton.jsx
import React from 'react';
import { Box, Skeleton, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const JobTablePaginationSkeleton = () => {
    return (
        <Box sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            minHeight: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: 2,
            gap: 3
        }}>
            {/* Rows per page - label normal with proper font size, count shows loader */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span style={{ fontSize: '0.875rem', color: 'rgba(0, 0, 0, 0.38)' }}>Rows per page:</span>
                <Skeleton variant="text" width={30} height={24} />
            </Box>

            {/* Pagination info - shows loader effect */}
            <Skeleton variant="text" width={100} height={20} />

            {/* Pagination controls - chevrons visible but disabled */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton disabled size="small">
                    <ChevronLeft />
                </IconButton>
                <IconButton disabled size="small">
                    <ChevronRight />
                </IconButton>
            </Box>
        </Box>
    );
};

export default JobTablePaginationSkeleton;