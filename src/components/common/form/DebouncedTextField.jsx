import { useState, useEffect, useCallback } from 'react';
import { TextField } from '@mui/material';

const DebouncedTextField = ({
  value: propValue,
  onChange,
  onBlur,
  delay = 300,
  validateOnBlur = true,
  ...props
}) => {
  const [value, setValue] = useState(propValue || '');
  const [isTouched, setIsTouched] = useState(false);

  // Sync with prop value
  useEffect(() => {
    setValue(propValue || '');
  }, [propValue]);

  // Debounced onChange
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (value !== propValue) {
        onChange(value);
        setIsTouched(true);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, delay, onChange, propValue]);

  // Handle blur
  const handleBlur = useCallback((e) => {
    setIsTouched(true);

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
      fullWidth
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

export default DebouncedTextField;