// features/clients/hooks/useClients.js
import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClients,
  fetchClientById,
  createClient,
  updateClient,
  deleteClient,
  setFilters,
  setSort,
  clearCurrentClient,
  clearError,
} from "../../../store/slices/features/clientSlice";

export const useClients = ({ limit = 5 } = {}) => {
  const dispatch = useDispatch();

  // Get state from Redux store
  const { clients, currentClient, pagination, loading, error, filters, sort } =
    useSelector((state) => state.clients);

  // Local state for backward compatibility
  const [localError, setLocalError] = useState(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Load clients with pagination
  const loadClients = useCallback(
    (page = 1, perPage = limit) => {
      console.log("Loading clients:", { page, perPage, filters, sort }); // Debug log
      dispatch(
        fetchClients({
          page,
          perPage,
          filters,
          sort,
        }),
      );
    },
    [dispatch, filters, sort, limit],
  );

  // Load clients on mount - THIS IS THE KEY FIX
  useEffect(() => {
    if (!initialLoadDone) {
      console.log("Initial client load triggered");
      loadClients(1, limit);
      setInitialLoadDone(true);
    }
  }, [loadClients, limit, initialLoadDone]);

  // Handle search
  const handleSearch = useCallback(
    (searchTerm) => {
      console.log("Search triggered:", searchTerm);
      dispatch(setFilters({ search: searchTerm }));
      // After setting filters, reload clients on page 1
      setTimeout(() => {
        loadClients(1, limit);
      }, 0);
    },
    [dispatch, loadClients, limit],
  );

  // Handle page change
  const handlePageChange = useCallback(
    (page) => {
      console.log("Page change:", page);
      loadClients(page, limit);
    },
    [loadClients, limit],
  );

  // Handle sort
  const handleSort = useCallback(
    (field, direction) => {
      console.log("Sort triggered:", field, direction);
      dispatch(setSort({ field, direction }));
      // After setting sort, reload clients
      setTimeout(() => {
        loadClients(1, limit);
      }, 0);
    },
    [dispatch, loadClients, limit],
  );

  // Refresh clients
  const refresh = useCallback(() => {
    console.log("Refresh triggered");
    loadClients(pagination.currentPage, limit);
  }, [loadClients, pagination.currentPage, limit]);

  // Get single client
const getClient = useCallback(
  async (id) => {
    try {
      console.log("Fetching client with id:", id);
      
      // Don't clear currentClient here - let the fetch handle it
      // Just fetch and return the result
      const result = await dispatch(fetchClientById(id)).unwrap();
      console.log("Client fetched successfully:", result);
      return result;
    } catch (err) {
      console.error("Error fetching client:", err);
      const errorMessage = err?.message || err?.data?.message || "Failed to fetch client";
      setLocalError(errorMessage);
      throw new Error(errorMessage);
    }
  },
  [dispatch],
);

  // Create client
  const createClientHandler = useCallback(
    async (clientData) => {
      try {
        console.log("Before dispatch - loading should be true");
        const result = await dispatch(createClient(clientData)).unwrap();
        console.log("After dispatch success - loading should be false");
        // After creating, refresh the list
        loadClients(1, limit);
        return result;
      } catch (err) {
        console.log("After dispatch error - loading should be false");
        setLocalError(err);
        throw err;
      }
    },
    [dispatch, loadClients, limit],
  );

  // Update client
  const updateClientHandler = useCallback(
    async (id, clientData) => {
      try {
        const result = await dispatch(
          updateClient({ id, data: clientData }),
        ).unwrap();
        // After updating, refresh the list
        loadClients(pagination.currentPage, limit);
        return result;
      } catch (err) {
        setLocalError(err);
        throw err;
      }
    },
    [dispatch, loadClients, pagination.currentPage, limit],
  );

  // Delete client
  const deleteClientHandler = useCallback(
    async (id) => {
      try {
        await dispatch(deleteClient(id)).unwrap();
        // After deleting, refresh the list
        loadClients(pagination.currentPage, limit);
      } catch (err) {
        setLocalError(err);
        throw err;
      }
    },
    [dispatch, loadClients, pagination.currentPage, limit],
  );

  // Clear error
  const clearError = useCallback(() => {
    setLocalError(null);
    dispatch(clearError());
  }, [dispatch]);

  return {
    // Data
    clients,
    currentClient,
    loading,
    error: error || localError,
    pagination: {
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      totalItems: pagination.total,
      perPage: pagination.perPage,
    },

    // Actions
    loadClients,
    handleSearch,
    handlePageChange,
    handleSort,
    refresh,
    getClient,
    createClient: createClientHandler,
    updateClient: updateClientHandler,
    deleteClient: deleteClientHandler,
    clearError,
  };
};
