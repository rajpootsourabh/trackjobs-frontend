import React, { useState, useCallback } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    IconButton,
    Button,
    Divider,
    Grid,
    Checkbox,
    FormControlLabel
} from "@mui/material";
import { Close } from "@mui/icons-material";
import DebouncedTextField from "../../../../components/common/form/DebouncedTextField";
import DebouncedSelect from "../../../../components/common/form/DebouncedSelect";

const AddRoleModal = ({ open, onClose }) => {
    const [form, setForm] = useState({
        role_name: "",
        role_description: "",
        role_level: "",
    });
    const [assignPermission, setAssignPermission] = useState(false);

    const roleLevelOptions = [
        { value: "admin", label: "Admin" },
        { value: "manager", label: "Manager" },
        { value: "supervisor", label: "Supervisor" },
        { value: "employee", label: "Employee" },
    ];

    const handleChange = useCallback((field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleSave = () => {
        console.log("Form Data:", { ...form, assignPermission });
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    maxWidth: 500,
                }
            }}
        >
            {/* Header */}
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: 600,
                    fontSize: "1.25rem",
                    px: 3,
                    py: 2,
                }}
            >
                Add Role
                <IconButton onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ px: 3, py: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <DebouncedTextField
                            label="Role Name"
                            placeholder="Enter Role Name"
                            value={form.role_name}
                            onChange={(val) => handleChange("role_name", val)}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <DebouncedTextField
                            label="Role Description"
                            placeholder="Enter Role Description"
                            value={form.role_description}
                            onChange={(val) => handleChange("role_description", val)}
                            multiline
                            rows={2}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <DebouncedSelect
                            label="Role Level"
                            value={form.role_level}
                            onChange={(val) => handleChange("role_level", val)}
                            options={roleLevelOptions}
                            fullWidth
                        />
                    </Grid>
                </Grid>

                {/* Assign Permission Checkbox */}
                <Box sx={{ mt: 1 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={assignPermission}
                                onChange={(e) => setAssignPermission(e.target.checked)}
                                size="small"
                            />
                        }
                        label="Assign Permission"
                    />
                </Box>
            </DialogContent>

            {/* Footer */}
            <Divider />
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    sx={{ textTransform: "none" }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{ textTransform: "none" }}
                >
                    Save
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{ textTransform: "none", px: 3 }}
                >
                    Save & Continue
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddRoleModal;