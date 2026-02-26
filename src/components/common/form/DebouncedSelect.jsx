import { useState, useEffect, useCallback } from 'react';
import { TextField, MenuItem, CircularProgress, InputAdornment } from '@mui/material';

const DebouncedSelect = ({ 
  value: propValue, 
  onChange, 
  delay = 300, 
  options = [],
  onBlur,
  loading = false,
  loadingLabel = "Loading",
  ...props 
}) => {
  const [value, setValue] = useState(propValue || '');
  const [isTouched, setIsTouched] = useState(false);

  // Sync with prop value
  useEffect(() => {
    setValue(propValue || '');
  }, [propValue]);

  // Debounced onChange with useCallback for stability
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (value !== propValue) {
        onChange(value);
        setIsTouched(true);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, delay, onChange, propValue]);

  // Handle blur with immediate update for validation
  const handleBlur = useCallback((e) => {
    setIsTouched(true);
    
    // Trigger immediate update on blur for validation
    if (value !== propValue) {
      onChange(value);
    }
    
    if (onBlur) onBlur(e);
  }, [value, propValue, onChange, onBlur]);

  // Handle change
  const handleChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  // Determine what to show in the select
  const getDisplayValue = () => {
    if (loading) {
      return ''; // Return empty when loading to show loading state
    }
    return value;
  };

  return (
    <TextField
      {...props}
      select={!loading} // Disable select functionality when loading
      value={getDisplayValue()}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={loading || props.disabled}
      InputProps={{
        ...props.InputProps,
        endAdornment: loading ? (
          <InputAdornment position="end">
            <CircularProgress size={20} />
          </InputAdornment>
        ) : props.InputProps?.endAdornment
      }}
      SelectProps={{
        ...props.SelectProps,
        IconComponent: loading ? () => null : props.SelectProps?.IconComponent // Hide chevron when loading
      }}
    >
      {loading ? (
        <MenuItem value="" disabled>
          {loadingLabel}...
        </MenuItem>
      ) : (
        options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))
      )}
    </TextField>
  );
};

export default DebouncedSelect;