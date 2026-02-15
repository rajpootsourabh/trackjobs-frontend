import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const HeaderSearch = ({
  value = '',
  onChange,
  placeholder = 'Search...',
  width = 240
}) => {
  return (
    <TextField
      size="small"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      sx={{
        width,
        '& .MuiOutlinedInput-root': {
          height: 38   // ← same as MUI button
        }
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        )
      }}
    />
  );
};

export default HeaderSearch;
