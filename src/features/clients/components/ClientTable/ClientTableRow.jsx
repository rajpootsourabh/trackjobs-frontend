// features/clients/components/ClientTable/ClientTableRow.jsx
import React from 'react';
import { TableRow, TableCell, Checkbox, Typography, Box, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import EllipsisText from '../../../../components/common/EllipsisText';
import ProfileAvatar from '../../../../components/common/avatar/ProfileAvatar';
import ClientCategoryChip from './ClientCategoryChip';
import StatusChip from '../../../../components/common/chips/StatusChip';
import { BUSINESS_TYPE_OPTIONS } from '../../constants/clientConstants';
import { Business } from '@mui/icons-material';
import { BriefcaseBusiness, Home } from 'lucide-react';

// Helper function to get business type label from value
const getBusinessTypeLabel = (value) => {
    if (!value) return null;
    const option = BUSINESS_TYPE_OPTIONS.find(opt => opt.value === value);
    return option ? option.label : value.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
};

// Helper function to get client type chip styling
const getClientTypeStyles = (type) => {
    return type === 'commercial'
        ? { bgcolor: '#e3f2fd', color: '#1976d2' }
        : { bgcolor: '#fff4e5', color: '#ed6c02' };
};

// Helper function to get primary client identifier
const getClientPrimaryIdentifier = (client) => {
    if (client.client_type === 'commercial') {
        return {
            primary: client.business_name || 'Unnamed Business',
            secondary: getBusinessTypeLabel(client.business_type)
        };
    } else {
        // Residential client - show full name
        const fullName = [client.first_name, client.last_name]
            .filter(Boolean)
            .join(' ') || 'Unnamed Client';
        return {
            primary: fullName,
            secondary: 'Residential Client'
        };
    }
};

const ClientTableRow = ({ client, isSelected, onSelect }) => {
    const { primary: clientPrimary, secondary: clientSecondary } = getClientPrimaryIdentifier(client);

    const contactName = client.contact_person_name ||
        (client.first_name && client.last_name ? `${client.first_name} ${client.last_name}` : 'N/A');

    const position = client.designation || 'N/A';
    const email = client.email || 'N/A';
    const phone = client.mobile_number || 'N/A';
    const category = client.service_category || 'regular';
    const status = client.status || 'active';
    const clientType = client.client_type || 'commercial';

    return (
        <TableRow hover selected={isSelected}>
            <TableCell padding="checkbox">
                <Checkbox size="small" checked={isSelected} onChange={() => onSelect(client.id)} />
            </TableCell>

            {/* Client / Business Column */}
            <TableCell>
                <Link to={`/customers/${client.id}/edit`} style={{ textDecoration: 'none' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {client.client_type === 'commercial' ? (
                            <BriefcaseBusiness
                                size={18}
                                color="#1976d2"
                            />
                        ) : (
                            <Home
                                size={18}
                                color="#ed6c02"
                            />
                        )}
                        <Box>
                            <EllipsisText
                                text={clientPrimary}
                                sx={{ fontSize: '0.9rem', fontWeight: 500 }}
                            />
                            {clientSecondary && (
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                    {clientSecondary}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Link>
            </TableCell>

            {/* Contact Person */}
            <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1.5 }}>
                    <ProfileAvatar name={contactName} position={position} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {/* <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                            {contactName}
                        </Typography> */}
                        {/* Client Type Badge */}
                        {/* <Chip
                            label={clientType === 'commercial' ? 'Commercial' : 'Residential'}
                            size="small"
                            sx={{
                                ...getClientTypeStyles(clientType),
                                height: 18,
                                '& .MuiChip-label': {
                                    fontSize: '0.7rem',
                                    px: 0.8,
                                    lineHeight: 1,
                                },
                                width: 'fit-content'
                            }}
                        /> */}
                    </Box>
                </Box>
            </TableCell>

            {/* Email */}
            <TableCell>
                <EllipsisText
                    text={email}
                    sx={{ fontSize: '0.9rem', fontWeight: 500, maxWidth: 200 }}
                />
            </TableCell>

            {/* Phone */}
            <TableCell>
                <EllipsisText
                    text={phone}
                    sx={{ fontSize: '0.9rem', fontWeight: 500 }}
                />
            </TableCell>

            {/* Category */}
            <TableCell>
                <ClientCategoryChip category={category} />
            </TableCell>

            {/* Status */}
            <TableCell>
                <StatusChip status={status} />
            </TableCell>
        </TableRow>
    );
};

export default ClientTableRow;