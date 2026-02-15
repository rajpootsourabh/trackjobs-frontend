// features/clients/components/ClientTable/ClientTableHeader.jsx
import React from 'react';
import { TableHead, TableRow, TableCell, Checkbox } from '@mui/material';

const ClientTableHeader = ({ selectAll, onSelectAll }) => {
    return (
        <TableHead>
            <TableRow 
                sx={{ 
                    backgroundColor: '#f9fafb',
                    '& .MuiTableCell-root': {
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: '#374151',
                        borderBottom: '1px solid',
                        borderColor: '#e5e7eb',
                    }
                }}
            >
                <TableCell padding="checkbox">
                    <Checkbox 
                        checked={selectAll} 
                        onChange={onSelectAll}
                        size="small"
                    />
                </TableCell>
                <TableCell>Client / Business</TableCell> {/* Changed from "Company Name" */}
                <TableCell>Contact Person</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
            </TableRow>
        </TableHead>
    );
};

export default ClientTableHeader;