// features/clients/hooks/useClientForm.js
import { useState } from 'react';
import { WEEKDAYS, WEEKEND_DAYS, ALL_DAYS } from '../constants/clientConstants';

export const useClientForm = (formik) => {
  const [clientType, setClientType] = useState('commercial');

  const handleDayToggle = (dayValue) => {
    const currentDays = formik.values.availability_schedule?.available_days || [];
    
    if (currentDays.includes(dayValue)) {
      formik.setFieldValue(
        'availability_schedule.available_days', 
        currentDays.filter(d => d !== dayValue)
      );
    } else {
      formik.setFieldValue(
        'availability_schedule.available_days', 
        [...currentDays, dayValue]
      );
    }
  };

  const handleSelectWeekdays = () => {
    const currentDays = formik.values.availability_schedule?.available_days || [];
    const allWeekdaysSelected = WEEKDAYS.every(day => currentDays.includes(day));

    if (allWeekdaysSelected) {
      // Remove all weekdays
      formik.setFieldValue(
        'availability_schedule.available_days',
        currentDays.filter(day => !WEEKDAYS.includes(day))
      );
    } else {
      // Add all weekdays (avoid duplicates)
      const newDays = [...new Set([...currentDays, ...WEEKDAYS])];
      formik.setFieldValue('availability_schedule.available_days', newDays);
    }
  };

  const handleSelectWeekend = () => {
    const currentDays = formik.values.availability_schedule?.available_days || [];
    const allWeekendSelected = WEEKEND_DAYS.every(day => currentDays.includes(day));

    if (allWeekendSelected) {
      // Remove all weekend days
      formik.setFieldValue(
        'availability_schedule.available_days',
        currentDays.filter(day => !WEEKEND_DAYS.includes(day))
      );
    } else {
      // Add all weekend days (avoid duplicates)
      const newDays = [...new Set([...currentDays, ...WEEKEND_DAYS])];
      formik.setFieldValue('availability_schedule.available_days', newDays);
    }
  };

  const handleSelectAllDays = () => {
    const currentDays = formik.values.availability_schedule?.available_days || [];
    const allSelected = ALL_DAYS.every(day => currentDays.includes(day));

    if (allSelected) {
      // Clear all days
      formik.setFieldValue('availability_schedule.available_days', []);
    } else {
      // Select all days
      formik.setFieldValue('availability_schedule.available_days', ALL_DAYS);
    }
  };

  // Helper function to initialize availability_schedule if it doesn't exist
  const ensureAvailabilitySchedule = () => {
    if (!formik.values.availability_schedule) {
      formik.setFieldValue('availability_schedule', {
        available_days: [],
        preferred_start_time: '09:00',
        preferred_end_time: '17:00',
        has_lunch_break: false,
        lunch_start: '12:00',
        lunch_end: '13:00',
        notes: '',
      });
    }
  };

  return {
    clientType,
    setClientType,
    handleDayToggle,
    handleSelectWeekdays,
    handleSelectWeekend,
    handleSelectAllDays,
    ensureAvailabilitySchedule,
  };
};