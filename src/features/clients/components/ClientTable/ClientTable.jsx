// features/clients/components/ClientTable/ClientTable.jsx
import React from 'react';
import { Paper, Table, TableBody, TableCell, TableRow, Box } from '@mui/material';
import ClientTableHeader from './ClientTableHeader';
import ClientTableRow from './ClientTableRow';
import ClientTablePagination from './ClientTablePagination';

const ClientTable = ({
  clients = [],
  selectedClients = [],
  onSelectClient,
  onSelectAll,
  selectAll,
  onPageChange,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 5,
  showPagination = false
}) => {
  // Convert to 0-based index for Material-UI pagination
  const pageIndex = currentPage - 1;

  const handlePageChange = (event, newPage) => {
    onPageChange(newPage + 1);
  };

  const handleRowsPerPageChange = (event) => {
    // If you want to handle rows per page change
    console.log('Rows per page:', event.target.value);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: 2,
          border: '1px solid',
          borderColor: '#e5e7eb',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          backgroundColor: '#fff',
          transition: 'box-shadow 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }
        }}
      >
        <Table>
          <ClientTableHeader selectAll={selectAll} onSelectAll={onSelectAll} />

          <TableBody>
            {clients.map((client) => (
              <ClientTableRow
                key={client.id}
                client={client}
                isSelected={selectedClients.includes(client.id)}
                onSelect={onSelectClient}
              />
            ))}

            {clients.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  No clients found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {showPagination && (
          <ClientTablePagination
            count={totalItems}
            page={pageIndex}
            rowsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        )}
      </Paper>
    </Box>
  );
};

export default ClientTable;