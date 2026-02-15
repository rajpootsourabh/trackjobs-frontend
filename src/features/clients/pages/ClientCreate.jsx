// features/customers/pages/ClientCreate.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients } from '../hooks/useClients';
import { useToast } from '../../../components/common/ToastProvider';
import PageHeader from '../../../components/common/PageHeader';
import NewClientForm from '../components/ClientForm/NewClientForm';

const ClientCreate = () => {
  const navigate = useNavigate();
  const { createClient, isLoading } = useClients();
  const { showToast } = useToast();

  const handleSubmit = async (formData) => {
    try {
      const result = await createClient(formData);
      showToast('Customer created successfully!', 'success');
      navigate('/customers');
    } catch (error) {
      showToast(error || 'Failed to create client', 'error');
      console.error('Failed to create client:', error);
    }
  };

  const handleCancel = () => {
    navigate('/customers');
  };

  const handleSaveAndCreateQuote = async (formData) => {
    try {
      const newClient = await createClient(formData);
      showToast('Customer created successfully!', 'success');
      navigate(`/quotes/create?clientId=${newClient.id}`);
    } catch (error) {
      showToast(error || 'Failed to create client', 'error');
      console.error('Failed to create client:', error);
    }
  };

  return (
    <>
      <PageHeader
        title="New Customer"
        subtitle="Add a new client by filling in their details below."
        breadcrumb={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Customers', path: '/customers' },
          { label: 'New Customer', current: true }
        ]}
      />
      <NewClientForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onSaveAndCreateQuote={handleSaveAndCreateQuote}
        isLoading={isLoading}
      />
    </>
  );
};

export default ClientCreate;