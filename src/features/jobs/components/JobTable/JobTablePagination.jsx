// src/features/jobs/components/JobTable/JobTablePagination.jsx
import React from 'react';
import { TablePagination, Box } from '@mui/material';

const JobTablePagination = ({
    count,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange
}) => {
    return (
        <Box sx={{ 
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper'
        }}>
            <TablePagination
                component="div"
                count={count}
                page={page}
                onPageChange={onPageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={onRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 15, 25, 50]}
                sx={{
                    '.MuiTablePagination-toolbar': {
                        minHeight: '52px',
                        px: 2
                    },
                    '.MuiTablePagination-selectLabel': {
                        mb: 0
                    },
                    '.MuiTablePagination-displayedRows': {
                        mb: 0
                    }
                }}
            />
        </Box>
    );
};

export default JobTablePagination;