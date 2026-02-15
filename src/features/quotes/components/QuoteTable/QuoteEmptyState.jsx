// features/quotes/components/QuoteTable/QuoteEmptyState.jsx
import React from 'react';
import { TableRow, TableCell, Box, Typography, Button } from '@mui/material';
import { FileText, Plus } from 'lucide-react';

const QuoteEmptyState = ({ colSpan = 8, onAddQuote }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} align="center" sx={{ py: 8 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FileText size={40} color="#9ca3af" />
          </Box>
          
          <Typography variant="h6" color="text.secondary" fontWeight={500}>
            No quotes found
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
            Get started by creating your first quote. You can create quotes for your clients and track their status.
          </Typography>
          
          {onAddQuote && (
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={onAddQuote}
              sx={{ mt: 2, textTransform: 'none' }}
            >
              Create New Quote
            </Button>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default QuoteEmptyState;