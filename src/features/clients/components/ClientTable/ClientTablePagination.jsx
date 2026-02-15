// features/clients/components/ClientTable/ClientTablePagination.jsx
import React from 'react';
import { TablePagination } from '@mui/material';

const ClientTablePagination = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange
}) => {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={onPageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPageOptions={[5, 10, 25]}
    />
  );
};

export default ClientTablePagination;