import { useEffect, useState } from 'react';

export const useDebouncedForm = (initialValues, delay = 300) => {
  const [values, setValues] = useState(initialValues);
  const [debouncedValues, setDebouncedValues] = useState(initialValues);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValues(values);
    }, delay);

    return () => clearTimeout(timer);
  }, [values, delay]);

  return {
    values,
    debouncedValues,
    setValues,
    handleChange: (e) => {
      const { name, value, type, checked } = e.target;
      setValues(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    },
  };
};