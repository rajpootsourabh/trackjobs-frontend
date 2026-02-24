import React, { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Button,
    Divider
} from "@mui/material";

// Initial modules data with permission flags
const initialModules = [
    { id: 1, name: "Employee Management", view: true, edit: true, delete: true, approve: true },
    { id: 2, name: "Time Management", view: true, edit: true, delete: true, approve: true },
    { id: 3, name: "Schedule", view: true, edit: true, delete: true, approve: true },
    { id: 4, name: "Payroll", view: true, edit: true, delete: true, approve: true },
    { id: 5, name: "Reports", view: true, edit: true, delete: true, approve: true },
    { id: 6, name: "Online Booking", view: true, edit: true, delete: true, approve: true },
    { id: 7, name: "Jobs", view: true, edit: true, delete: true, approve: true },
];

const PermissionMaster = ({ onSave, onCancel }) => {
    const [modules, setModules] = useState(initialModules);

    // Handle checkbox toggle
    const handlePermissionChange = (moduleId, permission) => {
        setModules(prev =>
            prev.map(module =>
                module.id === moduleId
                    ? { ...module, [permission]: !module[permission] }
                    : module
            )
        );
    };

    // Handle select all for a column
    const handleSelectAll = (permission) => {
        const allSelected = modules.every(module => module[permission]);
        setModules(prev =>
            prev.map(module => ({ ...module, [permission]: !allSelected }))
        );
    };

    const handleSave = () => {
        console.log("Saved permissions:", modules);
        if (onSave) onSave(modules);
    };

    const handleCancel = () => {
        setModules(initialModules);
        if (onCancel) onCancel();
    };

    return (
        <Box sx={{ width: "100%", maxWidth: 500, mx: "auto" }}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid #e5e7eb" }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Permission Master
                </Typography>

                <TableContainer>
                    <Table size="small" sx={{ tableLayout: "fixed" }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                                <TableCell sx={{ width: "40%" }}>Module</TableCell>
                                <TableCell align="center" sx={{ width: "15%" }}>
                                    View
                                    <Checkbox
                                        size="small"
                                        checked={modules.every(m => m.view)}
                                        indeterminate={modules.some(m => m.view) && !modules.every(m => m.view)}
                                        onChange={() => handleSelectAll("view")}
                                        sx={{ ml: 0.5 }}
                                    />
                                </TableCell>
                                <TableCell align="center" sx={{ width: "15%" }}>
                                    Edit
                                    <Checkbox
                                        size="small"
                                        checked={modules.every(m => m.edit)}
                                        indeterminate={modules.some(m => m.edit) && !modules.every(m => m.edit)}
                                        onChange={() => handleSelectAll("edit")}
                                        sx={{ ml: 0.5 }}
                                    />
                                </TableCell>
                                <TableCell align="center" sx={{ width: "15%" }}>
                                    Delete
                                    <Checkbox
                                        size="small"
                                        checked={modules.every(m => m.delete)}
                                        indeterminate={modules.some(m => m.delete) && !modules.every(m => m.delete)}
                                        onChange={() => handleSelectAll("delete")}
                                        sx={{ ml: 0.5 }}
                                    />
                                </TableCell>
                                <TableCell align="center" sx={{ width: "15%" }}>
                                    Approve
                                    <Checkbox
                                        size="small"
                                        checked={modules.every(m => m.approve)}
                                        indeterminate={modules.some(m => m.approve) && !modules.every(m => m.approve)}
                                        onChange={() => handleSelectAll("approve")}
                                        sx={{ ml: 0.5 }}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {modules.map((module) => (
                                <TableRow key={module.id} hover>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        sx={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        }}
                                    >
                                        {module.name}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Checkbox
                                            size="small"
                                            checked={module.view}
                                            onChange={() => handlePermissionChange(module.id, "view")}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Checkbox
                                            size="small"
                                            checked={module.edit}
                                            onChange={() => handlePermissionChange(module.id, "edit")}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Checkbox
                                            size="small"
                                            checked={module.delete}
                                            onChange={() => handlePermissionChange(module.id, "delete")}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Checkbox
                                            size="small"
                                            checked={module.approve}
                                            onChange={() => handlePermissionChange(module.id, "approve")}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Divider sx={{ my: 2 }} />

                {/* Action buttons */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                    <Button variant="outlined" onClick={handleCancel} sx={{ textTransform: "none" }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSave} sx={{ textTransform: "none" }}>
                        Save
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default PermissionMaster;