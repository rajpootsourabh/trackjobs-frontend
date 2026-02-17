// features/customers/pages/ClientEdit.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClients } from '../hooks/useClients';
import { useToast } from '../../../components/common/ToastProvider';
import PageHeader from '../../../components/common/PageHeader';
import Loader from '../../../components/common/Loader/Loader';
import ClientForm from '../components/ClientForm/ClientForm';

const ClientEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getClient, updateClient, loading, currentClient } = useClients();
  const { showToast } = useToast();
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setIsFetching(true);
        setFetchError(false);
        await getClient(id);
      } catch (error) {
        console.error('Failed to fetch client:', error);
        setFetchError(true);
        showToast('Failed to load client data', 'error');
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      fetchClient();
    }
  }, [id, getClient, showToast]);

  const handleSubmit = async (formData) => {
    try {
      await updateClient(id, formData);
      showToast('Customer updated successfully!', 'success');
      navigate('/customers');
    } catch (error) {
      showToast(error || 'Failed to update client', 'error');
      console.error('Failed to update client:', error);
    }
  };

  const handleCancel = () => {
    navigate('/customers');
  };

  // Show loader while fetching
  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  // Show error if fetch failed
  if (fetchError || !currentClient) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-600">Failed to load client data</p>
      </div>
    );
  }

  // Only render form when we have data
  return (
    <>
      <PageHeader
        title="Edit Customer"
        subtitle="Update client information below."
        breadcrumb={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Customers', path: '/customers' },
          { label: 'Edit Customer', current: true }
        ]}
      />
      <ClientForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialData={currentClient}
        isLoading={loading}
      />
    </>
  );
};

export default ClientEdit;