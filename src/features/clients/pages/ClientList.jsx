// features/customers/pages/ClientList.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients } from '../hooks/useClients';
import ClientTable from '../components/ClientTable/ClientTable';
import PageHeader from '../../../components/common/PageHeader';
import Loader from '../../../components/common/Loader/Loader';
import ErrorAlert from '../../../components/feedback/ErrorAlert';
import HeaderSearch from '../../../components/common/HeaderSearch';
import CustomButton from '../../../components/common/CustomButton';
import { Add } from '@mui/icons-material';

const ClientList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClients, setSelectedClients] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const searchDebounceRef = useRef(null);

    // Use the clients hook for API integration
    const {
        clients,
        loading,
        error,
        pagination,
        filters,
        handleSearch,
        handlePageChange: changePage,
        refresh,
        clearError,
    } = useClients({ limit: 5 });

    // Handle search with debounce
    const handleSearchChange = useCallback((value) => {
        setSearchTerm(value);

        // Clear previous timeout
        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }

        // Debounce API search
        searchDebounceRef.current = setTimeout(() => {
            handleSearch(value);
            setSelectAll(false);
            setSelectedClients([]);
        }, 300);
    }, [handleSearch]);

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            if (searchDebounceRef.current) {
                clearTimeout(searchDebounceRef.current);
            }
        };
    }, []);

    // Handle page change
    const handlePageChange = (page) => {
        changePage(page);
        setSelectAll(false);
        setSelectedClients([]);
    };

    // Handle select all
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedClients([]);
        } else {
            setSelectedClients(clients.map(client => client.id));
        }
        setSelectAll(!selectAll);
    };

    // Handle individual client selection
    const handleSelectClient = (clientId) => {
        if (selectedClients.includes(clientId)) {
            setSelectedClients(selectedClients.filter(id => id !== clientId));
        } else {
            setSelectedClients([...selectedClients, clientId]);
        }
    };

    // Update selectAll when clients change
    useEffect(() => {
        if (clients.length > 0 && selectedClients.length === clients.length) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [clients, selectedClients]);

    return (
        <div className="min-h-full bg-gray-50">
            <PageHeader
                breadcrumb={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Customers', current: true }
                ]}
                title="Customers"
                subtitle="View all your customers, manage their details, and keep track of your interactions."
                actions={
                    <>
                        <HeaderSearch
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search customers..."
                        />
                        <CustomButton label="New Customer" to="/customers/new" icon={Add} />
                    </>
                }
            />

            {error && (
                <ErrorAlert
                    message={error}
                    onRetry={refresh}
                    onClose={clearError}
                    className="mb-6"
                />
            )}

            <div className="bg-white rounded-lg mt-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader size="lg" />
                        <p className="mt-4 text-gray-600">Loading customers...</p>
                    </div>
                ) : (
                    <ClientTable
                        clients={clients}
                        selectedClients={selectedClients}
                        onSelectClient={handleSelectClient}
                        onSelectAll={handleSelectAll}
                        selectAll={selectAll}
                        onPageChange={handlePageChange}
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalItems}
                        itemsPerPage={pagination.perPage}
                        showPagination={true}
                    />
                )}
            </div>
        </div>
    );
};

export default ClientList;