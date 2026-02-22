import React from 'react';
import { Avatar, Box } from '@mui/material';
import EllipsisText from '../EllipsisText';

// Generate a consistent color based on string (name)
const stringToColor = (string) => {
    if (!string) return '#838587'; // Default gray for empty strings

    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
};

// Pre-defined color palette for consistent assignment
const colorPalette = [
    '#1976d2', // Blue
    '#2e7d32', // Green
    '#ed6c02', // Orange
    '#9c27b0', // Purple
    '#d32f2f', // Red
    '#0288d1', // Light Blue
    '#7b1fa2', // Deep Purple
    '#c2185b', // Pink
    '#f57c00', // Dark Orange
    '#388e3c', // Light Green
    '#5e35b1', // Indigo
    '#00838f', // Cyan
];

// Get color from pre-defined palette based on name (more consistent)
const getColorFromPalette = (name) => {
    if (!name) return '#838587';

    // Simple hash to get consistent index
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash += name.charCodeAt(i);
    }

    const index = hash % colorPalette.length;
    return colorPalette[index];
};

const getInitials = (text) => {
    if (!text) return '?';

    // Split by space and get first letter of each part
    const words = text.split(' ');
    if (words.length === 1) {
        // If single word, take first two letters
        return text.slice(0, 2).toUpperCase();
    }

    // Take first letter of first word and first letter of last word
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const ProfileAvatar = ({
    name,
    avatarSrc,
    sx = {},
    avatarSize = 30,
    showName = true,
    colorMode = 'palette',
    variant = 'circular',
}) => {
    // Choose color generation method
    const bgColor = colorMode === 'palette'
        ? getColorFromPalette(name)
        : stringToColor(name);

    return (
        <Box display="flex" alignItems="center" gap={1}>
            <Avatar
                src={avatarSrc}
                variant={variant}
                sx={{
                    width: avatarSize,
                    height: avatarSize,
                    bgcolor: bgColor,
                    fontSize: `${avatarSize * 0.4}px`,
                    fontWeight: 500,
                    ...sx
                }}
            >
                {!avatarSrc && getInitials(name)}
            </Avatar>

            {showName && (
                <Box>
                    <EllipsisText
                        text={name}
                        sx={{ fontSize: '0.9rem', fontWeight: 500 }}
                    />
                </Box>
            )}
        </Box>
    );
};

export default ProfileAvatar;