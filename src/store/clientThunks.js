// features/clients/store/clientThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import clientService from '../services/clientService';

// Fetch clients with pagination, filters, and sorting
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async ({ page = 1, perPage = 15, filters = {}, sort = {} } = {}, { rejectWithValue }) => {
    try {
      const params = {
        page,
        per_page: perPage,
        ...filters,
        sort_by: sort.field,
        sort_direction: sort.direction,
      };
      
      const response = await clientService.getAll(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch clients');
    }
  }
);

// Fetch single client by ID
export const fetchClientById = createAsyncThunk(
  'clients/fetchClientById',
  async (id, { rejectWithValue }) => {
    try {
      const client = await clientService.getById(id);
      return client;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch client');
    }
  }
);

// Create new client
export const createClient = createAsyncThunk(
  'clients/createClient',
  async (clientData, { rejectWithValue }) => {
    try {
      // Handle file upload if logo exists
      if (clientData.logo_file) {
        // Upload logo first
        const logoUrl = await uploadLogo(clientData.logo_file);
        clientData.logo = logoUrl;
      }
      
      const newClient = await clientService.create(clientData);
      return newClient;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create client');
    }
  }
);

// Update client
export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // Handle file upload if new logo exists
      if (data.logo_file) {
        const logoUrl = await uploadLogo(data.logo_file);
        data.logo = logoUrl;
      }
      
      const updatedClient = await clientService.update(id, data);
      return updatedClient;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update client');
    }
  }
);

// Delete client
export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (id, { rejectWithValue }) => {
    try {
      await clientService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete client');
    }
  }
);

// Helper function to upload logo
const uploadLogo = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'client_logo');
  
  const response = await clientService.client.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  
  return response.data.url;
};