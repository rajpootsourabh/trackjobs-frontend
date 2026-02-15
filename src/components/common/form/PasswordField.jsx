import React, { useState } from 'react';
import { useField } from 'formik';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const PasswordField = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const [showPassword, setShowPassword] = useState(false);
  const errorText = meta.error && meta.touched ? meta.error : '';

  return (
    <div className="mb-4">
      <TextField
        {...field}
        {...props}
        type={showPassword ? 'text' : 'password'}
        label={label}
        variant="outlined"
        fullWidth
        error={!!errorText}
        helperText={errorText}
        className="mt-1"
        InputProps={{
          className: "font-poppins text-sm",
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        InputLabelProps={{
          className: "font-poppins",
        }}
      />
    </div>
  );
};

export default PasswordField;