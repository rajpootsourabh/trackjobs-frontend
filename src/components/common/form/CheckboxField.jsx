import React from 'react';
import { useField } from 'formik';
import { FormControlLabel, Checkbox } from '@mui/material';

const CheckboxField = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';

  return (
    <div className="mb-4">
      <FormControlLabel
        control={
          <Checkbox
            {...field}
            {...props}
            checked={field.value}
            sx={{
              '&.Mui-checked': {
                color: '#226AD3',
              },
            }}
          />
        }
        label={label}
        className="font-poppins text-xs"
      />
      {errorText && (
        <div className="text-red-600 text-xs mt-1 ml-6">
          {errorText}
        </div>
      )}
    </div>
  );
};

export default CheckboxField;