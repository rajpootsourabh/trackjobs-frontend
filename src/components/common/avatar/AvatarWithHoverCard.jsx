// src/components/common/avatar/AvatarWithHoverCard.jsx
import React, { useState, useRef } from 'react';
import { Avatar, Box, Typography, Paper, Fade, Popper, Chip, Divider, ClickAwayListener } from '@mui/material';
import { Email, Phone, Business, AccessTime, Star } from '@mui/icons-material';
import EllipsisText from '../EllipsisText';

// Generate a consistent color based on string (name)
const stringToColor = (string) => {
    if (!string) return '#838587';

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

// Pre-defined color palette
const colorPalette = [
    '#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f',
    '#0288d1', '#7b1fa2', '#c2185b', '#f57c00', '#388e3c',
    '#5e35b1', '#00838f',
];

const getColorFromPalette = (name) => {
    if (!name) return '#838587';

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash += name.charCodeAt(i);
    }

    const index = hash % colorPalette.length;
    return colorPalette[index];
};

const getInitials = (text) => {
    if (!text) return '?';

    const words = text.split(' ');
    if (words.length === 1) {
        return text.slice(0, 2).toUpperCase();
    }

    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

// Format role/title nicely
const formatRole = (role) => {
    if (!role) return 'Team Member';
    return role.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
};

// Helper function to darken/lighten color
const adjustColor = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const r = (num >> 16) + percent;
    const g = ((num >> 8) & 0x00FF) + percent;
    const b = (num & 0x0000FF) + percent;

    const newR = Math.min(255, Math.max(0, r));
    const newG = Math.min(255, Math.max(0, g));
    const newB = Math.min(255, Math.max(0, b));

    return `#${(newR << 16 | newG << 8 | newB).toString(16).padStart(6, '0')}`;
};

const AvatarWithHoverCard = ({
    // Accept either direct props OR user object
    user,
    name = user?.full_name || user?.name || 'Unknown User',
    avatarSrc,
    sx = {},
    avatarSize = 34,
    showName = true,
    colorMode = 'palette',
    variant = 'circular',
    showHoverCard = true,
    hoverCardDelay = 300,

    // Additional custom props (will override user object)
    email: customEmail,
    phone: customPhone,
    role: customRole,
    department: customDepartment,
    status: customStatus,
    lastActive: customLastActive,
    joinDate: customJoinDate,
    location: customLocation,
    manager: customManager,
    skills: customSkills = [],
}) => {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    let hoverTimeout = null;
    let leaveTimeout = null;

    // Extract data from user object if provided
    const email = customEmail || user?.email;
    const status = customStatus || user?.status || 'active';
    const role = customRole || user?.role;
    const department = customDepartment || user?.department;
    const phone = customPhone || user?.phone || user?.contact_phone;
    const location = customLocation || user?.location || user?.office_location;
    const manager = customManager || user?.manager?.full_name || user?.manager_name;
    const joinDate = customJoinDate || user?.joined_at || user?.created_at;
    const lastActive = customLastActive || user?.last_active_at;
    const skills = customSkills.length > 0 ? customSkills : (user?.skills || []);

    const bgColor = colorMode === 'palette'
        ? getColorFromPalette(name)
        : stringToColor(name);

    const handleMouseEnter = () => {
        if (!showHoverCard) return;

        if (leaveTimeout) {
            clearTimeout(leaveTimeout);
        }

        hoverTimeout = setTimeout(() => {
            setOpen(true);
        }, hoverCardDelay);
    };

    const handleMouseLeave = () => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
        }

        leaveTimeout = setTimeout(() => {
            setOpen(false);
        }, 200);
    };

    const handleCardMouseEnter = () => {
        if (hoverTimeout) clearTimeout(hoverTimeout);
        if (leaveTimeout) clearTimeout(leaveTimeout);
    };

    const handleCardMouseLeave = () => {
        leaveTimeout = setTimeout(() => {
            setOpen(false);
        }, 200);
    };

    // Get status color and icon
    const getStatusDetails = () => {
        switch (status?.toLowerCase()) {
            case 'active':
            case 'online':
                return { color: '#4caf50', label: 'Active', icon: '●' };
            case 'away':
                return { color: '#ff9800', label: 'Away', icon: '●' };
            case 'busy':
            case 'dnd':
                return { color: '#f44336', label: 'Busy', icon: '●' };
            case 'offline':
                return { color: '#9e9e9e', label: 'Offline', icon: '○' };
            default:
                return { color: '#9e9e9e', label: 'Offline', icon: '○' };
        }
    };

    const statusDetails = getStatusDetails();

    return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Box>
                {/* Avatar Container - This is the anchor - EXACTLY like original ProfileAvatar */}
                <Box
                    ref={anchorRef}
                    display="flex"
                    alignItems="center"
                    gap={1}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    sx={{
                        cursor: showHoverCard ? 'pointer' : 'default',
                        display: 'inline-flex',
                    }}
                >
                    <Box sx={{ position: 'relative' }}>
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

                        {/* Status indicator dot */}
                        {showHoverCard && status && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    width: avatarSize * 0.25,
                                    height: avatarSize * 0.25,
                                    borderRadius: '50%',
                                    backgroundColor: statusDetails.color,
                                    border: '2px solid white',
                                    transform: 'translate(25%, 25%)',
                                }}
                            />
                        )}
                    </Box>

                    {showName && (
                        <Box>
                            <EllipsisText
                                text={name}
                                sx={{ fontSize: '0.9rem', fontWeight: 500 }}
                            />
                        </Box>
                    )}
                </Box>

                {/* Hover Card - Positioned Above */}
                <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    placement="top"
                    transition
                    sx={{
                        zIndex: 1300,
                    }}
                    modifiers={[
                        {
                            name: 'offset',
                            options: {
                                offset: [0, -10],
                            },
                        },
                        {
                            name: 'preventOverflow',
                            options: {
                                boundary: 'viewport',
                                padding: 8,
                            },
                        },
                        {
                            name: 'flip',
                            options: {
                                enabled: true,
                                altBoundary: true,
                                fallbackPlacements: ['bottom', 'right', 'left'],
                            },
                        },
                    ]}
                >
                    {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={200}>
                            <Paper
                                elevation={8}
                                sx={{
                                    width: 320,
                                    overflow: 'hidden',
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: -8,
                                        left: '20px',
                                        width: 0,
                                        height: 0,
                                        borderLeft: '8px solid transparent',
                                        borderRight: '8px solid transparent',
                                        borderTop: `8px solid ${bgColor}`,
                                    }
                                }}
                                onMouseEnter={handleCardMouseEnter}
                                onMouseLeave={handleCardMouseLeave}
                            >
                                {/* Header with large avatar */}
                                <Box sx={{
                                    p: 2,
                                    bgcolor: bgColor,
                                    background: `linear-gradient(135deg, ${bgColor} 0%, ${adjustColor(bgColor, -20)} 100%)`,
                                    color: 'white'
                                }}>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Avatar
                                            src={avatarSrc}
                                            sx={{
                                                width: 64,
                                                height: 64,
                                                bgcolor: 'rgba(255,255,255,0.2)',
                                                fontSize: '1.5rem',
                                                fontWeight: 500,
                                                border: '2px solid rgba(255,255,255,0.5)'
                                            }}
                                        >
                                            {!avatarSrc && getInitials(name)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                {name}
                                            </Typography>
                                            {role && (
                                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                    {formatRole(role)}
                                                </Typography>
                                            )}
                                            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                                                <Box
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        bgcolor: statusDetails.color
                                                    }}
                                                />
                                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                                    {statusDetails.label}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Contact Information */}
                                <Box sx={{ p: 2 }}>
                                    {(email || phone) && (
                                        <Box mb={2}>
                                            {email && (
                                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                    <Email sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                                        {email}
                                                    </Typography>
                                                </Box>
                                            )}
                                            {phone && (
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Phone sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                    <Typography variant="body2">{phone}</Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    )}

                                    <Divider sx={{ my: 1.5 }} />

                                    <Box>
                                        {department && (
                                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                <Business sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                <Typography variant="body2">{department}</Typography>
                                            </Box>
                                        )}
                                        {location && (
                                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                <Business sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                <Typography variant="body2">{location}</Typography>
                                            </Box>
                                        )}
                                        {joinDate && (
                                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                <Typography variant="body2">
                                                    Joined {new Date(joinDate).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </Typography>
                                            </Box>
                                        )}
                                        {manager && (
                                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                <Star sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                <Typography variant="body2">Manager: {manager}</Typography>
                                            </Box>
                                        )}
                                    </Box>

                                    {skills && skills.length > 0 && (
                                        <>
                                            <Divider sx={{ my: 1.5 }} />
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" gutterBottom>
                                                    Skills
                                                </Typography>
                                                <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                                                    {skills.map((skill, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={skill}
                                                            size="small"
                                                            sx={{
                                                                fontSize: '0.7rem',
                                                                height: 24,
                                                                bgcolor: '#f3f4f6'
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            </Box>
                                        </>
                                    )}

                                    {lastActive && (
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            display="block"
                                            sx={{ mt: 1, textAlign: 'right' }}
                                        >
                                            Last active: {new Date(lastActive).toLocaleString('en-US', {
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                hour12: true,
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </Typography>
                                    )}
                                </Box>
                            </Paper>
                        </Fade>
                    )}
                </Popper>
            </Box>
        </ClickAwayListener>
    );
};

export default AvatarWithHoverCard;