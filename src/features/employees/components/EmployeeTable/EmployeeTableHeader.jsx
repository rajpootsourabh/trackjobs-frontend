import React from "react";
import { TableHead, TableRow, TableCell, Checkbox } from "@mui/material";

const EmployeeTableHeader = ({ selectAll, onSelectAll }) => {
    return (
        <TableHead>
            <TableRow
                sx={{
                    backgroundColor: "#f9fafb",
                    "& .MuiTableCell-root": {
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        color: "#374151",
                        borderBottom: "1px solid #e5e7eb",
                        py: '12px', // Match row padding
                    },
                    "& .MuiTableCell-root:first-of-type": {
                        pl: '16px',
                        pr: '8px', // Match row padding
                    },
                    "& .MuiTableCell-root:last-of-type": {
                        pr: '16px',
                    }
                }}
            >
                <TableCell padding="checkbox" sx={{ width: 50 }}>
                    <Checkbox
                        size="small"
                        checked={selectAll}
                        onChange={onSelectAll}
                        sx={{
                            p: '4px', // Match row checkbox padding
                        }}
                    />
                </TableCell>
                <TableCell>Employee ID</TableCell>
                <TableCell>Employee Name</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Email ID</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Action</TableCell>
            </TableRow>
        </TableHead>
    );
};

export default EmployeeTableHeader;