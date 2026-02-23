import React, { useState } from "react";
import { Box } from "@mui/material";
import PageHeader from "../../../components/common/PageHeader";
import HeaderSearch from "../../../components/common/HeaderSearch";
import CustomButton from "../../../components/common/CustomButton";
import { Add } from "@mui/icons-material";
import EmployeeTable from "../components/EmployeeTable/EmployeeTable";
import EmployeeModal from "../components/EmployeeForm/AddEmployeeModal";
import { useEmployees } from "../hooks/useEmployees";

const EmployeeList = () => {
    const { employees, loading, pagination } = useEmployees();

    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    // ✅ Modal state
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleSelectEmployee = (id) => {
        setSelectedEmployees(prev =>
            prev.includes(id)
                ? prev.filter(emp => emp !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedEmployees([]);
        } else {
            setSelectedEmployees(employees.map(e => e.id));
        }
        setSelectAll(!selectAll);
    };

    return (
        <div className="min-h-full bg-gray-50">
            <PageHeader
                breadcrumb={[
                    { label: "Dashboard", path: "/dashboard" },
                    { label: "Employee Management", current: true },
                ]}
                title="Employee Management"
                subtitle="View, manage, and update employee information easily."
                actions={
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <HeaderSearch placeholder="Search employees..." />
                        <CustomButton
                            label="Add Employee"
                            icon={Add}
                            onClick={handleOpenModal}
                        />
                    </Box>
                }
            />

            <div className="bg-white rounded-lg mt-6">
                <EmployeeTable
                    employees={employees}
                    selectedEmployees={selectedEmployees}
                    onSelectEmployee={handleSelectEmployee}
                    onSelectAll={handleSelectAll}
                    selectAll={selectAll}
                    currentPage={pagination.currentPage}
                    totalItems={pagination.totalItems}
                    itemsPerPage={pagination.perPage}
                    showPagination={true}
                />
            </div>

            {/* ✅ Modal Render */}
            <EmployeeModal
                open={openModal}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default EmployeeList;