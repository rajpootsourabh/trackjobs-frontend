import React from 'react';
import { useField } from 'formik';
import { TextField } from '@mui/material';

const FormField = ({ label, type = 'text', ...props }) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';

  return (
    <div className="mb-1 relative">
      <TextField
        {...field}
        {...props}
        type={type}
        label={label}
        variant="outlined"
        fullWidth
        error={!!errorText}
        helperText={errorText}
        sx={{
          '& .MuiOutlinedInput-root': {
            height: '52px',
            fontFamily: "'Poppins', sans-serif",
            fontSize: '12.6px',
            fontWeight: 300,
            '& fieldset': {
              borderColor: '#6C6A6A',
              borderWidth: '0.66px',
              borderRadius: '9px',
            },
            '&:hover fieldset': {
              borderColor: '#226AD3',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#226AD3',
              borderWidth: '1px',
            },
          },
          '& .MuiInputLabel-root': {
            fontFamily: "'Poppins', sans-serif",
            fontSize: '12.6px',
            fontWeight: 500,
            color: '#6C6A6A',
            backgroundColor: 'white',
            padding: '0 5px',
            marginLeft: '-5px',
            '&.Mui-focused': {
              color: '#226AD3',
            },
          },
          '& .MuiFormHelperText-root': {
            fontFamily: "'Poppins', sans-serif",
            fontSize: '11px',
            marginLeft: '10px',
            marginTop: '2px',
          },
        }}
      />
    </div>
  );
};

export default FormField;