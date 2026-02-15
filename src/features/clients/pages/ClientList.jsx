// features/customers/pages/ClientList.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients } from '../hooks/useClients';
import { DUMMY_CLIENTS } from '../../../utils/constants';
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

    // Use the clients hook for API integration (now connected to Redux)
    const {
        clients,
        loading,
        error,
        pagination,
        handleSearch,
        handlePageChange: changePage,
        refresh,
        clearError,
    } = useClients({ limit: 5 });

    console.log('ClientList state:', {
        clients,
        loading,
        error,
        pagination,
        isUsingDummyData: clients.length === 0 && !loading
    });

    // Use API clients if available, otherwise fall back to dummy data
    const displayClients = clients.length > 0 ? clients : DUMMY_CLIENTS;
    const isUsingDummyData = clients.length === 0 && !loading;

    // Local pagination for dummy data fallback
    const [localPage, setLocalPage] = useState(1);
    const itemsPerPage = 5;

    // Calculate pagination based on data source
    const currentPage = isUsingDummyData ? localPage : pagination.currentPage;
    const totalItems = isUsingDummyData ? displayClients.length : pagination.totalItems;
    const totalPages = isUsingDummyData
        ? Math.ceil(displayClients.length / itemsPerPage)
        : pagination.totalPages;

    // Filter clients locally for dummy data
    const filteredClients = isUsingDummyData
        ? displayClients.filter(
            (client) =>
                client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (client.contactPerson && client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : displayClients;

    // Paginate locally for dummy data
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedClients = isUsingDummyData
        ? filteredClients.slice(startIndex, startIndex + itemsPerPage)
        : filteredClients;

    // Handle search with debounce
    const handleSearchChange = useCallback((value) => {
        setSearchTerm(value);

        // Clear previous timeout
        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }

        // Debounce API search
        searchDebounceRef.current = setTimeout(() => {
            if (!isUsingDummyData) {
                handleSearch(value);
            }
        }, 300);
    }, [handleSearch, isUsingDummyData]);

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
        if (isUsingDummyData) {
            setLocalPage(page);
        } else {
            changePage(page);
        }
        setSelectAll(false);
        setSelectedClients([]);
    };

    // Handle select all
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedClients([]);
        } else {
            setSelectedClients(paginatedClients.map(client => client.id));
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

    return (
        <div className="min-h-full bg-gray-50">
            <PageHeader
                breadcrumb={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Customers', current: true }
                ]}
                title="Customers"
                subtitle={"View all your customers, manage their details, and keep track of your interactions."}
                actions={
                    <>
                        <HeaderSearch
                            value={searchTerm}
                            onChange={handleSearchChange}
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
                {loading && clients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader size="lg" />
                        <p className="mt-4 text-gray-600">Loading clients...</p>
                    </div>
                ) : (
                    <ClientTable
                        clients={paginatedClients}
                        selectedClients={selectedClients}
                        onSelectClient={handleSelectClient}
                        onSelectAll={handleSelectAll}
                        selectAll={selectAll}
                        onPageChange={handlePageChange}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        showPagination={true}
                    />
                )}
            </div>
        </div>
    );
};

export default ClientList;