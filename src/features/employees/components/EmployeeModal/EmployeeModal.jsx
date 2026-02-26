// features/employees/components/EmployeeModal/EmployeeModal.jsx
import React, { useState, useEffect, useRef } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    IconButton,
    Button,
    Switch,
    Divider,
    Fade,
    CircularProgress
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Formik, Form } from "formik";
import { useEmployees } from "../../hooks/useEmployees";
import { useToast } from "../../../../components/common/ToastProvider";
import BasicInformation from "../EmployeeForm/BasicInformation";
import ContactDetails from "../EmployeeForm/ContactDetails";
import OfficialDetails from "../EmployeeForm/OfficialDetails";
import { employeeValidationSchema } from "../../schemas/employeeValidationSchemas";
import { INITIAL_EMPLOYEE_VALUES } from "../../constants/employeeConstants";
import {
    DESIGNATION_LABEL_TO_VALUE,
    DEPARTMENT_LABEL_TO_VALUE,
} from "../../constants/employeeConstants";

const EmployeeModal = ({
    open,
    onClose,
    employeeId = null,
    mode = "create",
    onSuccess
}) => {
    const { createEmployee, updateEmployee, getEmployee } = useEmployees();
    const { showToast } = useToast();
    const [initialValues, setInitialValues] = useState(INITIAL_EMPLOYEE_VALUES);
    const [isFetching, setIsFetching] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [action, setAction] = useState(null); // Track which action is being performed

    // Add refs to prevent infinite loops and duplicate fetches
    const hasFetchedRef = useRef(false);
    const fetchInProgressRef = useRef(false);
    const prevOpenRef = useRef(open);
    const prevEmployeeIdRef = useRef(employeeId);

    // Transform API data to form values
    const transformApiToForm = (apiData) => {
        // Convert designation label to value if needed
        let designation = apiData.designation;
        if (designation && DESIGNATION_LABEL_TO_VALUE[designation]) {
            designation = DESIGNATION_LABEL_TO_VALUE[designation];
        }

        // Convert department label to value if needed
        let department = apiData.department;
        if (department && DEPARTMENT_LABEL_TO_VALUE[department]) {
            department = DEPARTMENT_LABEL_TO_VALUE[department];
        }

        return {
            employee_id: apiData.employee_id || "",
            first_name: apiData.first_name || "",
            last_name: apiData.last_name || "",
            date_of_birth: apiData.date_of_birth || "",
            gender: apiData.gender || "female",
            email: apiData.email || "",
            mobile_number: apiData.mobile_number || "",
            address: apiData.address || "",
            designation: designation || "",
            department: department || "",
            reporting_manager_id: apiData.reporting_manager?.id || null, // Use null instead of empty string
            is_active: apiData.is_active ?? true,
        };
    };

    // Transform form values to API payload
    const transformFormToApi = (formValues) => {
        return {
            employee_id: formValues.employee_id,
            first_name: formValues.first_name,
            last_name: formValues.last_name,
            date_of_birth: formValues.date_of_birth,
            gender: formValues.gender,
            email: formValues.email,
            mobile_number: formValues.mobile_number,
            address: formValues.address,
            designation: formValues.designation,
            department: formValues.department,
            reporting_manager_id: formValues.reporting_manager_id || null,
            is_active: formValues.is_active,
        };
    };

    // Reset fetch flag when modal closes
    useEffect(() => {
        if (!open) {
            hasFetchedRef.current = false;
            fetchInProgressRef.current = false;
            setInitialValues(INITIAL_EMPLOYEE_VALUES);
            setAction(null);
        }
    }, [open]);

    // Fetch employee data when modal opens in edit mode - FIXED
    useEffect(() => {
        const shouldFetch =
            open &&
            mode === "edit" &&
            employeeId &&
            !fetchInProgressRef.current &&
            (!hasFetchedRef.current || prevEmployeeIdRef.current !== employeeId);

        if (shouldFetch) {
            const fetchEmployee = async () => {
                fetchInProgressRef.current = true;
                setIsFetching(true);

                try {
                    const employee = await getEmployee(employeeId);
                    const transformedValues = transformApiToForm(employee);
                    setInitialValues(transformedValues);

                    hasFetchedRef.current = true;
                    prevEmployeeIdRef.current = employeeId;
                } catch (error) {
                    console.error("Error fetching employee:", error);
                    showToast("Failed to load employee data", "error");
                    onClose();
                } finally {
                    setIsFetching(false);
                    fetchInProgressRef.current = false;
                }
            };

            fetchEmployee();
        }

        prevOpenRef.current = open;

    }, [open, mode, employeeId, getEmployee, onClose, showToast]);

    const handleSubmit = async (values, { resetForm }) => {
        setIsSubmitting(true);

        try {
            const payload = transformFormToApi(values);

            let result;
            if (mode === "edit") {
                result = await updateEmployee(employeeId, payload);
                showToast("Employee updated successfully!", "success");
            } else {
                result = await createEmployee(payload);
                showToast("Employee created successfully!", "success");
            }

            if (onSuccess) {
                onSuccess(result);
            }

            resetForm();
            onClose();
        } catch (error) {
            showToast(error.message || `Failed to ${mode} employee`, "error");
        } finally {
            setIsSubmitting(false);
            setAction(null);
        }
    };

    // Handle save button click - matches client form pattern
    const handleSaveClick = async (formikProps) => {
        // Set the action
        setAction('save');

        // Validate all fields first
        const errors = await formikProps.validateForm();

        // Manually set all fields as touched to show errors
        const touched = {};
        Object.keys(formikProps.values).forEach(key => {
            touched[key] = true;
        });
        formikProps.setTouched(touched);

        // If no errors, submit the form
        if (Object.keys(errors).length === 0) {
            formikProps.submitForm();
        } else {
            setAction(null);
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting && !isFetching) {
            onClose();
        }
    };

    const title = mode === "edit" ? "Edit Employee" : "Add Employee";

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            TransitionComponent={Fade}
            transitionDuration={300}
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    py: 0,
                    px: 2,
                    minHeight: '600px'
                }
            }}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={employeeValidationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
                validateOnChange={true}
                validateOnBlur={true}
            >
                {(formikProps) => {
                    return (
                        <Form>
                            {/* Header */}
                            <DialogTitle
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    fontWeight: 600
                                }}
                            >
                                {title}
                                <IconButton onClick={handleClose} disabled={isSubmitting || isFetching}>
                                    <Close />
                                </IconButton>
                            </DialogTitle>

                            <Divider />

                            <DialogContent
                                sx={{
                                    mt: 0,
                                    height: '70vh',
                                    minHeight: '450px',
                                    overflow: 'auto',
                                    position: 'relative',
                                    '&::-webkit-scrollbar': {
                                        width: '6px',
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        background: '#f1f1f1',
                                        borderRadius: '10px',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        background: '#c1c1c1',
                                        borderRadius: '10px',
                                        '&:hover': {
                                            background: '#a8a8a8',
                                        },
                                    },
                                }}
                            >
                                {isFetching ? (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '100%',
                                            minHeight: '300px',
                                            gap: 2
                                        }}
                                    >
                                        <CircularProgress size={40} />
                                        <Typography variant="body2" color="text.secondary">
                                            Loading employee data...
                                        </Typography>
                                    </Box>
                                ) : (
                                    <>
                                        {/* Basic Information Section */}
                                        <Typography fontWeight={600} mb={2}>
                                            Basic Information
                                        </Typography>
                                        <BasicInformation
                                            formik={formikProps}
                                            mode={mode}
                                        />

                                        {/* Contact Details Section */}
                                        <Box mt={4}>
                                            <Typography fontWeight={600} mb={2}>
                                                Contact Details
                                            </Typography>
                                            <ContactDetails
                                                formik={formikProps}
                                            />
                                        </Box>

                                        {/* Official Details Section */}
                                        <Box mt={4} mb={2}>
                                            <Typography fontWeight={600} mb={2}>
                                                Official Details
                                            </Typography>
                                            <OfficialDetails
                                                formik={formikProps}
                                                employeeId={employeeId}
                                                mode={mode}
                                            />
                                        </Box>
                                    </>
                                )}
                            </DialogContent>

                            <Divider />

                            {/* Footer */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    px: 3,
                                    py: 1
                                }}
                            >
                                {/* Left side - Role and Active */}
                                <Box display="flex" alignItems="center">
                                    <Typography sx={{ minWidth: 45, fontWeight: 500 }}>Role:</Typography>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Switch
                                            checked={formikProps.values.is_active}
                                            onChange={(e) => formikProps.setFieldValue("is_active", e.target.checked)}
                                            size="small"
                                            disabled={isSubmitting || isFetching}
                                        />
                                        <Typography>Active</Typography>
                                    </Box>
                                </Box>

                                {/* Right side - Buttons - CHANGED to match client form pattern */}
                                <Box display="flex" gap={1}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleClose}
                                        disabled={isSubmitting || isFetching}
                                        sx={{ textTransform: "none" }}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        variant="contained"
                                        type="button"  // Changed from "submit" to "button"
                                        disabled={isSubmitting || isFetching}
                                        onClick={() => handleSaveClick(formikProps)}  // Manual click handler
                                        sx={{ textTransform: "none", px: 3 }}
                                    >
                                        {isSubmitting && action === 'save' ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : (isSubmitting ? "Saving..." : mode === "edit" ? "Update" : "Save")}
                                    </Button>
                                </Box>
                            </Box>
                        </Form>
                    );
                }}
            </Formik>
        </Dialog>
    );
};

export default EmployeeModal;