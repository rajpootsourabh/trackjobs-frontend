import React from "react";
import { Paper, Table, TableBody, TableRow, TableCell, Box } from "@mui/material";
import EmployeeTableHeader from "./EmployeeTableHeader";
import EmployeeTableRow from "./EmployeeTableRow";
import EmployeeTablePagination from "./EmployeeTablePagination";

const EmployeeTable = ({
    employees = [],
    selectedEmployees = [],
    onSelectEmployee,
    onSelectAll,
    selectAll,
    currentPage = 1,
    totalItems = 0,
    itemsPerPage = 5,
    onPageChange,
    onRowsPerPageChange,
    showPagination = false,
}) => {

    const emptyRows = itemsPerPage - employees.length;

    return (
        <Box sx={{ width: "100%" }}>
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 2,
                    border: "1px solid #e5e7eb",
                    overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
            >
                <Table>
                    <EmployeeTableHeader
                        selectAll={selectAll}
                        onSelectAll={onSelectAll}
                    />

                    <TableBody>
                        {employees.map((employee) => (
                            <EmployeeTableRow
                                key={employee.id}
                                employee={employee}
                                isSelected={selectedEmployees.includes(employee.id)}
                                onSelect={onSelectEmployee}
                            />
                        ))}

                        {/* Empty Rows */}
                        {emptyRows > 0 &&
                            Array.from({ length: emptyRows }).map((_, index) => (
                                <TableRow key={index} sx={{ height: 73 }}>
                                    <TableCell colSpan={9} sx={{ borderBottom: "none" }} />
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>

                {showPagination && (
                    <EmployeeTablePagination
                        count={totalItems}
                        page={currentPage - 1}
                        rowsPerPage={itemsPerPage}
                        onPageChange={onPageChange}
                        onRowsPerPageChange={onRowsPerPageChange}
                    />
                )}
            </Paper>
        </Box>
    );
};

export default EmployeeTable;