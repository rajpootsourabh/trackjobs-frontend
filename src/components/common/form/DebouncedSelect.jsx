import { useState, useEffect, useCallback } from 'react';
import { TextField, MenuItem } from '@mui/material';

const DebouncedSelect = ({ 
  value: propValue, 
  onChange, 
  delay = 300, 
  options = [],
  onBlur,
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

  return (
    <TextField
      {...props}
      select
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default DebouncedSelect;