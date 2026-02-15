// features/quotes/pages/QuoteList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuotesTable from '../components/QuoteTable/QuotesTable';
import PageHeader from '../../../components/common/PageHeader';
import CustomButton from '../../../components/common/CustomButton';
import HeaderSearch from '../../../components/common/HeaderSearch';
import { Plus } from 'lucide-react';
import { useQuotes } from '../hooks/useQuotes';

const QuoteList = () => {
    const navigate = useNavigate();
    const [selectedQuotes, setSelectedQuotes] = useState([]);

    // Use the custom hook
    const {
        quotes,
        loading,
        error,
        pagination,
        filters,
        handleSearch,
        handlePageChange,
        handleSort,
        deleteQuote,
        refresh,
        clearError
    } = useQuotes({ limit: 10, autoFetch: true });

    // Handle error display
    useEffect(() => {
        if (error) {
            // Auto-clear error after 5 seconds
            const timer = setTimeout(() => {
                clearError();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);

    const handleEdit = (quoteId) => {
        navigate(`/quotes/${quoteId}/edit`);
    };

    const handleDelete = async (quoteId) => {
        if (window.confirm('Are you sure you want to delete this quote?')) {
            try {
                await deleteQuote(quoteId);
                // Refresh the list after deletion
                refresh();
            } catch (err) {
                console.error('Failed to delete quote:', err);
            }
        }
    };

    const handleAddQuote = () => {
        navigate('/quotes/new');
    };

    const handleRowsPerPageChange = (event) => {
        // You'll need to add this to your hook if you want to change rows per page
        const newLimit = parseInt(event.target.value, 10);
        // This would require extending your hook to support changing limit
        console.log('Change rows per page to:', newLimit);
    };

    // Transform pagination to match table expectations
    const tablePagination = {
        page: pagination.currentPage - 1, // Convert to 0-based for table
        rowsPerPage: pagination.perPage,
        total: pagination.totalItems,
        onPageChange: handlePageChange,
        onRowsPerPageChange: handleRowsPerPageChange
    };

    // Simple loading indicator
    if (loading && quotes.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-2 text-gray-600">Loading quotes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gray-50">
            <PageHeader
                breadcrumb={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Quotes', current: true }
                ]}
                title="Quotes"
                subtitle="Manage and track all your quotes"
                actions={
                    <>
                        <HeaderSearch
                            value={filters.search || ''}
                            onChange={handleSearch}
                            placeholder="Search quotes..."
                        />
                        <CustomButton
                            label="New Quote"
                            onClick={handleAddQuote}
                            icon={Plus}
                        />
                    </>
                }
            />

            {/* Simple Error Alert */}
            {error && (
                <div className="mt-4 mx-4">
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                            <div className="ml-auto pl-3">
                                <button
                                    onClick={clearError}
                                    className="inline-flex text-red-400 focus:outline-none"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* FIXED: Removed p-4 to match client list */}
            <div className="bg-white rounded-lg mt-6">
                <QuotesTable
                    data={quotes}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onSelect={setSelectedQuotes}
                    selectedQuotes={selectedQuotes}
                    pagination={tablePagination}
                    onSort={handleSort}
                    sortField={filters.sortField}
                    sortDirection={filters.sortDirection}
                />
            </div>
        </div>
    );
};

export default QuoteList;