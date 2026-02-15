// features/quotes/components/QuoteTable/QuoteStatusChip.jsx
import React from 'react';
import { Chip } from '@mui/material';

const STATUS_STYLES = {
    draft: {
        color: "#6b7280",
        bg: "#f3f4f6",
        border: "#e5e7eb",
    },
    sent: {
        color: "#2563eb",
        bg: "#eef2ff",
        border: "#c7d2fe",
    },
    accept: {
        color: "#ea580c",
        bg: "#fff7ed",
        border: "#fed7aa",
    },
    expire: {
        color: "#dc2626",
        bg: "#fef2f2",
        border: "#fecaca",
    },
};

const QuoteStatusChip = ({ status }) => {
    const style = STATUS_STYLES[status?.toLowerCase()] || {
        color: "#6b7280",
        bg: "#f3f4f6",
        border: "#e5e7eb",
    };

    // Capitalize first letter
    const displayStatus = status ? status.charAt(0).toUpperCase() + status.slice(1) : '';

    return (
        <Chip
            label={displayStatus}
            size="small"
            sx={{
                borderRadius: 1,
                fontWeight: 500,
                color: style.color,
                backgroundColor: style.bg,
                border: `1px solid ${style.border}`,
                height: 24,
                '& .MuiChip-label': {
                    px: 1,
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    lineHeight: 1.5,
                }
            }}
        />
    );
};

export default QuoteStatusChip;