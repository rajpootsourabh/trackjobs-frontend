import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import EllipsisText from '../EllipsisText';

const getInitials = (text) => {
    if (!text) return '?';
    return text
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

const ProfileAvatar = ({
    name,
    subtitle,
    avatarSrc,
    sx = {},
    avatarSize = 34
}) => {
    return (
        <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar
                src={avatarSrc}
                sx={{
                    width: avatarSize,
                    height: avatarSize,
                    bgcolor: '#838587',
                    fontSize: '0.85rem',
                    ...sx
                }}
            >
                {!avatarSrc && getInitials(name)}
            </Avatar>

            <Box>
                <EllipsisText
                    text={name}
                    sx={{ fontSize: '0.9rem', fontWeight: 500 }}
                />

                {subtitle && (
                    <Typography variant="body2" color="text.secondary">
                        {subtitle}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default ProfileAvatar;
