// features/jobs/components/AssignJob/AssignJobForm.jsx
import React, { useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Divider
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import DebouncedTextField from "../../../../components/common/form/DebouncedTextField";
import DebouncedSelect from "../../../../components/common/form/DebouncedSelect";

// Mock data for shifts
const SHIFT_OPTIONS = [
    { value: "morning", label: "Morning Shift (6 AM - 2 PM)" },
    { value: "afternoon", label: "Afternoon Shift (2 PM - 10 PM)" },
    { value: "night", label: "Night Shift (10 PM - 6 AM)" },
    { value: "general", label: "General Shift (9 AM - 6 PM)" },
];

// Mock data for employees (assign to)
const EMPLOYEE_OPTIONS = [
    { value: "emp1", label: "John Doe (Senior Developer)" },
    { value: "emp2", label: "Jane Smith (Project Manager)" },
    { value: "emp3", label: "Mike Johnson (UI/UX Designer)" },
    { value: "emp4", label: "Sarah Williams (QA Engineer)" },
    { value: "emp5", label: "David Brown (Backend Developer)" },
];

const validationSchema = Yup.object({
    job_name: Yup.string()
        .required("Job name is required"),
    assign_to: Yup.string()
        .required("Please select an employee"),
    shift: Yup.string()
        .required("Please select a shift"),
});

const AssignJobForm = () => {
    const [employeeSearch, setEmployeeSearch] = useState("");

    const initialValues = {
        job_name: "Website Re-design for BrightTech",
        assign_to: "",
        shift: "",
    };

    const handleSubmit = (values, { setSubmitting }) => {
        console.log("Form values:", values);
        // Handle form submission here
        setTimeout(() => {
            setSubmitting(false);
        }, 1000);
    };

    // Filter employee options based on search
    const filteredEmployeeOptions = EMPLOYEE_OPTIONS.filter(option =>
        option.label.toLowerCase().includes(employeeSearch.toLowerCase())
    );

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                    backgroundColor: "#fff"
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        mb: 3,
                        color: "#1a1a1a",
                        fontSize: "1.5rem"
                    }}
                >
                    Assign Job
                </Typography>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {(formikProps) => (
                        <Form>
                            <Grid container spacing={3}>
                                {/* Job Name Field */}
                                <Grid item xs={12}>
                                    <DebouncedTextField
                                        name="job_name"
                                        label="Job Name"
                                        placeholder="Enter job name"
                                        value={formikProps.values.job_name}
                                        onChange={(val) => formikProps.setFieldValue("job_name", val)}
                                        onBlur={formikProps.handleBlur}
                                        error={formikProps.touched.job_name && Boolean(formikProps.errors.job_name)}
                                        helperText={formikProps.touched.job_name && formikProps.errors.job_name}
                                        fullWidth
                                        required
                                        InputProps={{
                                            sx: {
                                                borderRadius: 1.5,
                                                backgroundColor: "#f9f9f9",
                                                "&:hover": {
                                                    backgroundColor: "#fff",
                                                },
                                                "&.Mui-focused": {
                                                    backgroundColor: "#fff",
                                                },
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Assign To Field */}
                                <Grid item xs={12}>
                                    <DebouncedSelect
                                        name="assign_to"
                                        label="Assign To"
                                        placeholder="Select"
                                        value={formikProps.values.assign_to}
                                        onChange={(value) => {
                                            formikProps.setFieldValue("assign_to", value);
                                            formikProps.setFieldTouched("assign_to", true, true);
                                        }}
                                        onBlur={formikProps.handleBlur}
                                        options={filteredEmployeeOptions}
                                        onSearchChange={setEmployeeSearch}
                                        fullWidth
                                        required
                                        searchable
                                        InputProps={{
                                            sx: {
                                                borderRadius: 1.5,
                                                backgroundColor: "#f9f9f9",
                                                "&:hover": {
                                                    backgroundColor: "#fff",
                                                },
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Select Shift Field */}
                                <Grid item xs={12}>
                                    <DebouncedSelect
                                        name="shift"
                                        label="Select Shift"
                                        placeholder="Select"
                                        value={formikProps.values.shift}
                                        onChange={(value) => {
                                            formikProps.setFieldValue("shift", value);
                                            formikProps.setFieldTouched("shift", true, true);
                                        }}
                                        onBlur={formikProps.handleBlur}
                                        options={SHIFT_OPTIONS}
                                        fullWidth
                                        required
                                        InputProps={{
                                            sx: {
                                                borderRadius: 1.5,
                                                backgroundColor: "#f9f9f9",
                                                "&:hover": {
                                                    backgroundColor: "#fff",
                                                },
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Divider */}
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                </Grid>

                                {/* Submit Button */}
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        disabled={formikProps.isSubmitting}
                                        sx={{
                                            textTransform: "none",
                                            fontWeight: 600,
                                            py: 1.5,
                                            borderRadius: 2,
                                            fontSize: "1rem",
                                            backgroundColor: "#1976d2",
                                            "&:hover": {
                                                backgroundColor: "#1565c0",
                                            },
                                        }}
                                    >
                                        {formikProps.isSubmitting ? "Assigning..." : "Assign Job"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Box>
    );
};

export default AssignJobForm;