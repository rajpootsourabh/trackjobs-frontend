// features/quotes/components/QuoteTable/QuoteActions.jsx
import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { EditIcon, Trash2, Eye, Download, Send } from 'lucide-react';

const QuoteActions = ({
    quoteId,
    onEdit,
    onDelete,
    onView,
    onDownload,
    onSend,
    showView = false,
    showDownload = false,
    showSend = false,
    size = "small"
}) => {
    const handleEdit = (e) => {
        e.stopPropagation();
        if (onEdit) onEdit(quoteId);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (onDelete) onDelete(quoteId);
    };

    const handleView = (e) => {
        e.stopPropagation();
        if (onView) onView(quoteId);
    };

    const handleDownload = (e) => {
        e.stopPropagation();
        if (onDownload) onDownload(quoteId);
    };

    const handleSend = (e) => {
        e.stopPropagation();
        if (onSend) onSend(quoteId);
    };

    return (
        <Box display="flex" gap={0.5}>

            <Tooltip title="Edit Quote">
                <IconButton size={size} onClick={handleEdit}>
                    <EditIcon size={size === 'small' ? 16 : 18} />
                </IconButton>
            </Tooltip>

            <Tooltip title="Delete Quote">
                <IconButton size={size} onClick={handleDelete}>
                    <Trash2 size={size === 'small' ? 16 : 18} />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default QuoteActions;