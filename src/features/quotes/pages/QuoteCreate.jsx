// features/quotes/pages/QuoteCreate.jsx
import React, { useState, useEffect } from 'react';
import { Box, Alert, Snackbar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import QuoteForm from '../components/QuoteForm/QuoteForm';
import PageHeader from '../../../components/common/PageHeader';
import CustomButton from '../../../components/common/CustomButton';
import { useQuotes } from '../hooks/useQuotes';
import { useClients } from '../../clients/hooks/useClients';

const QuoteCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createQuote, loading, error, success, clearSuccess, clearError } = useQuotes();
  const { clients, loadClients, loading: clientsLoading } = useClients({ limit: 100 });
  const [submitError, setSubmitError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [initialData, setInitialData] = useState({});

  // console.log('🎯 QuoteCreate rendered', { 
  //   loading, 
  //   error, 
  //   success, 
  //   clientsCount: clients?.length,
  //   clientsLoading 
  // });

  // Check if we have a pre-selected client from navigation state
  useEffect(() => {
    console.log('📦 Checking location state for selected client:', location.state);
    if (location.state?.selectedClient) {
      const { selectedClient } = location.state;
      console.log('✅ Selected client found:', selectedClient);
      setInitialData({
        client_id: selectedClient.id,
        client_name: selectedClient.name,
        client_email: selectedClient.email,
      });
    }
  }, [location.state]);

  // Load clients for dropdown
  useEffect(() => {
    console.log('📦 Loading clients...');
    loadClients(1, 100);
  }, [loadClients]);

  // Handle success message
  useEffect(() => {
    console.log('📦 Success effect triggered:', { success });
    if (success) {
      setSnackbar({
        open: true,
        message: success,
        severity: 'success'
      });
      clearSuccess();

      setTimeout(() => {
        console.log('⏰ Navigating to quotes page');
        navigate('/quotes');
      }, 1500);
    }
  }, [success, clearSuccess, navigate]);

  // Handle error message
  useEffect(() => {
    console.log('📦 Error effect triggered:', { error });
    if (error) {
      setSubmitError(error);
      setSnackbar({
        open: true,
        message: error,
        severity: 'error'
      });
      clearError();
    }
  }, [error, clearError]);

  const handleSubmit = async (quoteData) => {
    console.log('🎯 handleSubmit called in QuoteCreate with data:', quoteData);
    setSubmitError(null);

    try {
      const formattedData = {
        ...quoteData,
        line_items: quoteData.line_items?.map((item, index) => {
          const formattedItem = {
            ...item,
            unit_price: parseFloat(item.unit_price) || 0,
            quantity: parseInt(item.quantity) || 1,
            tax_rate: parseFloat(item.tax_rate) || 0,
          };
          console.log(`📦 Formatted item ${index}:`, formattedItem);
          return formattedItem;
        }) || [],
      };
      
      console.log('📤 Sending formatted data to createQuote:', formattedData);
      const result = await createQuote(formattedData);
      console.log('✅ createQuote result:', result);
    } catch (err) {
      console.error('❌ Error in handleSubmit:', err);
      setSubmitError(err.message || 'Failed to create quote');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSaveDraft = () => {
    console.log('📝 Save as draft clicked');
  };

  const handleSendQuote = () => {
    console.log('📧 Send quote clicked');
  };

  return (
    <Box>
      <PageHeader
        breadcrumb={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Quotes', path: '/quotes' },
          { label: 'Create Quote', current: true }
        ]}
        title="New Quote"
        subtitle="Fill in the details below to create a new quote for your client."
      />

      <QuoteForm
        onSubmit={handleSubmit}
        isLoading={loading}
        submitError={submitError}
        clients={clients}
        loadingClients={clientsLoading}
        initialData={initialData}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QuoteCreate;