import React from 'react';
import {
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  FormHelperText
} from '@mui/material';
import SectionHeader from '../../../../components/common/form/SectionHeader';
import DebouncedTextField from '../../../../components/common/form/DebouncedTextField';
import { DAYS_OF_WEEK, WEEKDAYS, WEEKEND_DAYS, ALL_DAYS } from '../../constants/clientConstants';
import { useClientForm } from '../../hooks/useClientForm';

const AvailabilitySchedule = ({ formik, sectionNumber = '6' }) => {  // Default to '6' for backward compatibility
  const {
    handleDayToggle,
    handleSelectWeekdays,
    handleSelectWeekend,
    handleSelectAllDays
  } = useClientForm(formik);

  const getSelectedCount = () => {
    const count = formik.values.availability_schedule?.available_days?.length || 0;
    return `${count} day${count !== 1 ? 's' : ''} selected`;
  };

  const isAllDaysSelected = formik.values.availability_schedule?.available_days?.length === ALL_DAYS.length;
  const isWeekdaysSelected = WEEKDAYS.every(day => 
    formik.values.availability_schedule?.available_days?.includes(day)
  );
  const isWeekendSelected = WEEKEND_DAYS.every(day => 
    formik.values.availability_schedule?.available_days?.includes(day)
  );

  // Helper to get nested error
  const getNestedError = (fieldPath) => {
    const error = fieldPath.split('.').reduce((obj, key) => obj?.[key], formik.errors);
    const touched = fieldPath.split('.').reduce((obj, key) => obj?.[key], formik.touched);
    return touched && error ? error : null;
  };

  // Error for available days (array field)
  const availableDaysError = getNestedError('availability_schedule.available_days');
  
  // Error for the entire schedule (if needed)
  const scheduleError = getNestedError('availability_schedule');

  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        mb: 4,
        borderRadius: 2,
        backgroundColor: '#fff',
        // border: scheduleError ? '1px solid #d32f2f' : 'none', // Optional: highlight entire section if error
      }}
    >
      <SectionHeader
        number={sectionNumber}  // Use the passed section number
        title="Availability Schedule"
      />

      <Grid container spacing={3}>
        {/* Available Days - Checkbox Group with Quick Select Buttons */}
        <Grid item xs={12}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1.5,
            flexWrap: 'wrap',
            gap: 1
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: availableDaysError ? 'error.main' : 'text.secondary', 
                fontWeight: 500 
              }}
            >
              Available Days {availableDaysError && '*'}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleSelectAllDays}
                sx={{
                  minWidth: '70px',
                  backgroundColor: isAllDaysSelected ? 'primary.main' : 'transparent',
                  color: isAllDaysSelected ? 'white' : 'primary.main',
                  borderColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: isAllDaysSelected ? 'primary.dark' : 'rgba(25,118,210,0.04)',
                  }
                }}
              >
                {isAllDaysSelected ? '✓ All Days' : 'All Days'}
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={handleSelectWeekdays}
                sx={{
                  minWidth: '70px',
                  backgroundColor: isWeekdaysSelected ? 'primary.main' : 'transparent',
                  color: isWeekdaysSelected ? 'white' : 'primary.main',
                  borderColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: isWeekdaysSelected ? 'primary.dark' : 'rgba(25,118,210,0.04)',
                  }
                }}
              >
                {isWeekdaysSelected ? '✓ Weekdays' : 'Weekdays'}
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={handleSelectWeekend}
                sx={{
                  minWidth: '70px',
                  backgroundColor: isWeekendSelected ? 'primary.main' : 'transparent',
                  color: isWeekendSelected ? 'white' : 'primary.main',
                  borderColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: isWeekendSelected ? 'primary.dark' : 'rgba(25,118,210,0.04)',
                  }
                }}
              >
                {isWeekendSelected ? '✓ Weekend' : 'Weekend'}
              </Button>
            </Box>
          </Box>

          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.5,
            px: 1,
            py: 1,
            border: '1px solid',
            borderColor: availableDaysError ? 'error.main' : 'divider',
            borderRadius: 1,
            bgcolor: 'background.default'
          }}>
            {DAYS_OF_WEEK.map((day) => (
              <FormControlLabel
                key={day.value}
                control={
                  <Checkbox
                    checked={formik.values.availability_schedule?.available_days?.includes(day.value) || false}
                    onChange={() => {
                      handleDayToggle(day.value);
                      // Mark as touched when user interacts
                      formik.setFieldTouched('availability_schedule.available_days', true);
                    }}
                    name={`availability_schedule.available_days.${day.value}`}
                    size="small"
                    sx={{
                      color: availableDaysError ? 'error.main' : 'primary.main',
                      '&.Mui-checked': {
                        color: availableDaysError ? 'error.main' : 'primary.main',
                      },
                    }}
                  />
                }
                label={day.label}
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.875rem',
                    fontWeight: formik.values.availability_schedule?.available_days?.includes(day.value) ? 500 : 400,
                  },
                  minWidth: '80px',
                  m: 0,
                  p: 0.5,
                  borderRadius: 1,
                  backgroundColor: formik.values.availability_schedule?.available_days?.includes(day.value)
                    ? availableDaysError ? 'rgba(211, 47, 47, 0.08)' : 'rgba(25, 118, 210, 0.08)'
                    : 'transparent',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  }
                }}
              />
            ))}
          </Box>

          {/* Error message for available days */}
          {availableDaysError && (
            <FormHelperText error sx={{ mt: 1, ml: 0 }}>
              {availableDaysError}
            </FormHelperText>
          )}

          {/* Show selected count */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {getSelectedCount()}
            </Typography>
          </Box>
        </Grid>

        {/* Preferred Working Hours */}
        <Grid item xs={12} md={6}>
          <DebouncedTextField
            name="availability_schedule.preferred_start_time"
            label="Preferred Start Time"
            type="time"
            value={formik.values.availability_schedule?.preferred_start_time}
            onChange={(value) => {
              formik.setFieldValue('availability_schedule.preferred_start_time', value);
              formik.setFieldTouched('availability_schedule.preferred_start_time', true);
            }}
            onBlur={formik.handleBlur}
            fullWidth
            required
            error={getNestedError('availability_schedule.preferred_start_time')}
            helperText={getNestedError('availability_schedule.preferred_start_time')}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300,
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DebouncedTextField
            name="availability_schedule.preferred_end_time"
            label="Preferred End Time"
            type="time"
            value={formik.values.availability_schedule?.preferred_end_time}
            onChange={(value) => {
              formik.setFieldValue('availability_schedule.preferred_end_time', value);
              formik.setFieldTouched('availability_schedule.preferred_end_time', true);
            }}
            onBlur={formik.handleBlur}
            fullWidth
            required
            error={getNestedError('availability_schedule.preferred_end_time')}
            helperText={getNestedError('availability_schedule.preferred_end_time')}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300,
            }}
          />
        </Grid>

        {/* Lunch Break Checkbox */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.availability_schedule?.has_lunch_break || false}
                onChange={(e) => {
                  formik.setFieldValue('availability_schedule.has_lunch_break', e.target.checked);
                  formik.setFieldTouched('availability_schedule.has_lunch_break', true);
                }}
                name="availability_schedule.has_lunch_break"
                color="primary"
              />
            }
            label="Has Lunch Break"
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: '0.9375rem',
                color: 'text.secondary',
              },
            }}
          />
        </Grid>

        {/* Conditional Lunch Break Times */}
        {formik.values.availability_schedule?.has_lunch_break && (
          <>
            <Grid item xs={12} md={6}>
              <DebouncedTextField
                name="availability_schedule.lunch_start"
                label="Lunch Start Time"
                type="time"
                value={formik.values.availability_schedule?.lunch_start}
                onChange={(value) => {
                  formik.setFieldValue('availability_schedule.lunch_start', value);
                  formik.setFieldTouched('availability_schedule.lunch_start', true);
                }}
                onBlur={formik.handleBlur}
                fullWidth
                required
                error={getNestedError('availability_schedule.lunch_start')}
                helperText={getNestedError('availability_schedule.lunch_start')}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <DebouncedTextField
                name="availability_schedule.lunch_end"
                label="Lunch End Time"
                type="time"
                value={formik.values.availability_schedule?.lunch_end}
                onChange={(value) => {
                  formik.setFieldValue('availability_schedule.lunch_end', value);
                  formik.setFieldTouched('availability_schedule.lunch_end', true);
                }}
                onBlur={formik.handleBlur}
                fullWidth
                required
                error={getNestedError('availability_schedule.lunch_end')}
                helperText={getNestedError('availability_schedule.lunch_end')}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300,
                }}
              />
            </Grid>
          </>
        )}

        {/* Availability Notes */}
        <Grid item xs={12}>
          <DebouncedTextField
            name="availability_schedule.notes"
            label="Availability Notes"
            value={formik.values.availability_schedule?.notes}
            onChange={(value) => {
              formik.setFieldValue('availability_schedule.notes', value);
              formik.setFieldTouched('availability_schedule.notes', true);
            }}
            onBlur={formik.handleBlur}
            multiline
            rows={3}
            fullWidth
            placeholder="Any special instructions or notes about availability..."
            error={getNestedError('availability_schedule.notes')}
            helperText={getNestedError('availability_schedule.notes')}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AvailabilitySchedule;