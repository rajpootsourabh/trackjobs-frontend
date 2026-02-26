// features/employees/components/EmployeeForm/OfficialDetails.jsx
import React, { useEffect, useState, useRef } from "react";
import { Grid } from "@mui/material";
import DebouncedSelect from "../../../../components/common/form/DebouncedSelect";
import employeeService from "../../services/employeeService";
import {
    DESIGNATION_OPTIONS,
    DEPARTMENT_OPTIONS,
} from "../../constants/employeeConstants";

const OfficialDetails = ({ formik, employeeId, mode = "create" }) => {
    const [managerOptions, setManagerOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchInProgressRef = useRef(false);
    const abortControllerRef = useRef(null);

    // Fetch managers - only exclude current employee in edit mode
    useEffect(() => {
        const fetchManagers = async () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (fetchInProgressRef.current) return;

            abortControllerRef.current = new AbortController();
            fetchInProgressRef.current = true;
            setLoading(true);

            try {
                // Build params - only add exclude_id in edit mode when employeeId exists
                const params = {
                    search: searchTerm || undefined,
                    per_page: 50
                };
                
                // Only exclude current employee in edit mode
                if (mode === "edit" && employeeId) {
                    params.exclude_id = employeeId;
                }

                const response = await employeeService.getManagers(params, abortControllerRef.current.signal);

                const managers = response.data || [];
                const options = managers.map((manager) => ({
                    value: manager.value || manager.id,
                    label: manager.label ||
                        `${manager.first_name || ''} ${manager.last_name || ''}`.trim() +
                        (manager.employee_id ? ` (${manager.employee_id})` : ''),
                }));
                setManagerOptions(options);
            } catch (error) {
                if (error.name !== 'AbortError' && error.code !== 'ERR_CANCELED') {
                    console.error("Failed to fetch managers:", error);
                }
            } finally {
                setLoading(false);
                fetchInProgressRef.current = false;
                abortControllerRef.current = null;
            }
        };

        const timeoutId = setTimeout(fetchManagers, 300);
        return () => {
            clearTimeout(timeoutId);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [searchTerm, employeeId, mode]);

    // Simple onChange handlers - matching client form pattern
    const handleDesignationChange = (value) => {
        formik.setFieldValue("designation", value);
        // Formik will automatically validate on change
    };

    const handleDepartmentChange = (value) => {
        formik.setFieldValue("department", value);
        // Formik will automatically validate on change
    };

    const handleManagerChange = (value) => {
        formik.setFieldValue("reporting_manager_id", value);
        // Formik will automatically validate on change
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <DebouncedSelect
                    name="designation"
                    label="Designation"
                    placeholder="Select Designation"
                    value={formik.values.designation || ""} // Direct formik value, no transformation
                    onChange={handleDesignationChange}
                    onBlur={formik.handleBlur}
                    options={DESIGNATION_OPTIONS}
                    fullWidth
                    size="medium"
                    error={formik.touched.designation && Boolean(formik.errors.designation)}
                    helperText={formik.touched.designation && formik.errors.designation}
                    required
                />
            </Grid>

            <Grid item xs={6}>
                <DebouncedSelect
                    name="department"
                    label="Department"
                    placeholder="Select Department"
                    value={formik.values.department || ""} // Direct formik value, no transformation
                    onChange={handleDepartmentChange}
                    onBlur={formik.handleBlur}
                    options={DEPARTMENT_OPTIONS}
                    fullWidth
                    size="medium"
                    error={formik.touched.department && Boolean(formik.errors.department)}
                    helperText={formik.touched.department && formik.errors.department}
                    required
                />
            </Grid>

            <Grid item xs={6}>
                <DebouncedSelect
                    name="reporting_manager_id"
                    label={loading ? "Loading Managers..." : "Reporting Manager"}
                    placeholder="Select Reporting Manager"
                    value={formik.values.reporting_manager_id || ""} // Direct formik value
                    onChange={handleManagerChange}
                    onBlur={formik.handleBlur}
                    options={managerOptions}
                    fullWidth
                    size="medium"
                    loadingLabel="Loading managers"
                    loading={loading}
                    onSearchChange={setSearchTerm}
                    error={formik.touched.reporting_manager_id && Boolean(formik.errors.reporting_manager_id)}
                    helperText={
                        formik.touched.reporting_manager_id && formik.errors.reporting_manager_id
                    }
                    disabled={loading}
                />
            </Grid>
        </Grid>
    );
};

export default OfficialDetails;