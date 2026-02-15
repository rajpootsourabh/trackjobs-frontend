// features/quotes/components/QuoteTable/QuoteTableRow.jsx
import React from 'react';
import { TableRow, TableCell, Checkbox, Box, IconButton } from '@mui/material';
import { Edit, Delete, Eye, Trash2Icon } from 'lucide-react';
import QuoteStatusChip from './QuoteStatusChip';
import EllipsisText from '../../../../components/common/EllipsisText';

const QuoteTableRow = ({
  quote,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onView
}) => {
  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    if (onSelect) onSelect(quote.id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <TableRow
      hover
      selected={isSelected}
      sx={{
        '&:hover': {
          backgroundColor: 'rgba(0,0,0,0.02)',
        },
        '& .MuiTableCell-root': {
          py: '12px',
          px: '8px',
          fontSize: '0.875rem',
          borderBottom: '1px solid',
          borderColor: '#e5e7eb',
        },
        '& .MuiTableCell-root:first-of-type': {
          pl: '16px',
          pr: '8px', // Match header padding
        },
        '& .MuiTableCell-root:last-of-type': {
          pr: '16px',
        }
      }}
    >
      <TableCell padding="checkbox" sx={{ width: 50 }}>
        <Checkbox
          checked={isSelected}
          onChange={handleCheckboxChange}
          size="small"
          sx={{
            p: '4px', // Match header checkbox padding
          }}
        />
      </TableCell>

      <TableCell sx={{ width: 100 }}>
        <EllipsisText
          text={quote.quote_number || 'N/A'}
          sx={{ fontWeight: 500, fontSize: '0.9rem' }}
        />
      </TableCell>

      <TableCell sx={{ width: 200 }}>
        <EllipsisText
          text={quote.title || 'N/A'}
          sx={{ fontWeight: 500, fontSize: '0.9rem' }}
        />
      </TableCell>

      <TableCell sx={{ width: 180 }}>
        <EllipsisText
          text={quote.client_name || 'N/A'}
          sx={{ fontWeight: 500, fontSize: '0.9rem' }}
        />
      </TableCell>

      <TableCell sx={{ width: 120 }}>
        <EllipsisText
          text={formatDate(quote.created_at)}
          sx={{ color: 'text.secondary', fontSize: '0.9rem' }}
        />
      </TableCell>

      <TableCell sx={{ width: 120 }}>
        <EllipsisText
          text={formatDate(quote.expires_at)}
          sx={{ color: 'text.secondary', fontSize: '0.9rem' }}
        />
      </TableCell>

      <TableCell sx={{ width: 100, fontWeight: 500 }}>
        <EllipsisText
          text={formatCurrency(quote.total_amount, quote.currency)}
          sx={{ fontWeight: 600, color: '#183B59', fontSize: '0.9rem' }}
        />
      </TableCell>

      <TableCell sx={{ width: 100 }}>
        <QuoteStatusChip status={quote.status} />
      </TableCell>

      <TableCell sx={{ width: 100 }}>
        <Box display="flex" gap={0.5} alignItems="center">
          {onView && (
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onView?.(quote.id); }}
              sx={{
                p: '4px',
                color: '#6b7280',
                '&:hover': { color: '#1976d2' }
              }}
            >
              <Eye size={16} />
            </IconButton>
          )}

          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); onEdit?.(quote.id); }}
            sx={{
              p: '4px',
              color: '#6b7280',
              '&:hover': { color: '#1976d2' }
            }}
            disabled={!quote.can_edit}
          >
            <Edit size={16} />
          </IconButton>

          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); onDelete?.(quote.id); }}
            sx={{
              p: '4px',
              color: '#6b7280',
              '&:hover': { color: '#d32f2f' }
            }}
          >
            <Trash2Icon size={16} />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default QuoteTableRow;