// features/quotes/components/QuoteTable/QuoteTablePagination.jsx
import React from 'react';
import { TablePagination } from '@mui/material';

const QuoteTablePagination = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25, 50]
}) => {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={onPageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPageOptions={rowsPerPageOptions}
      sx={{
        borderTop: '1px solid #e5e7eb',
        '& .MuiTablePagination-select': {
          fontSize: '0.875rem',
        },
        '& .MuiTablePagination-displayedRows': {
          fontSize: '0.875rem',
        }
      }}
    />
  );
};

export default QuoteTablePagination;