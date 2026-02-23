import { useState, useEffect } from "react";
import employeesMock from "../mock/employeesMock";

export const useEmployees = ({ autoFetch = true } = {}) => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        perPage: 5,
        totalItems: 0,
        totalPages: 1,
    });

    const fetchEmployees = async () => {
        setLoading(true);

        // 🔁 Replace this with API call later
        setTimeout(() => {
            setEmployees(employeesMock);
            setPagination(prev => ({
                ...prev,
                totalItems: employeesMock.length,
                totalPages: 1,
            }));
            setLoading(false);
        }, 500);
    };

    useEffect(() => {
        if (autoFetch) fetchEmployees();
    }, []);

    return {
        employees,
        loading,
        pagination,
        refresh: fetchEmployees,
    };
};