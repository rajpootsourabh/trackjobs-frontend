// features/online-booking/pages/OnlineBooking.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import { useToast } from '../../../components/common/ToastProvider';
import PageHeader from '../../../components/common/PageHeader';
import BookingForm from '../components/BookingForm/BookingForm';

const OnlineBooking = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      // API call would go here
      console.log('Booking submitted:', formData);
      showToast('Booking created successfully!', 'success');
      navigate('/bookings');
    } catch (error) {
      showToast(error || 'Failed to create booking', 'error');
      console.error('Failed to create booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <PageHeader
        title="Online Booking"
        subtitle="Book a service by filling in the details below."
        breadcrumb={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Online Booking', current: true }
        ]}
      />
      <BookingForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default OnlineBooking;