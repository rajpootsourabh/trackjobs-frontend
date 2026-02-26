import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TextField,
  MenuItem,
  CircularProgress,
  InputAdornment,
  Popper,
  Paper,
  List,
  ListItem,
  InputBase,
  Box,
  ClickAwayListener
} from '@mui/material';
import { Search as SearchIcon, ArrowDropDown as ArrowDropDownIcon } from '@mui/icons-material';

const SearchableSelect = ({
  value,
  onChange,
  options = [],
  label,
  placeholder = "Select an option",
  loading = false,
  loadingLabel = "Loading...",
  searchPlaceholder = "Search...",
  noOptionsMessage = "No options found",
  disabled = false,
  error = false,
  helperText,
  fullWidth = false,
  size = "medium",
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValue, setSelectedValue] = useState(value || '');
  const [anchorEl, setAnchorEl] = useState(null);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    
    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  // Find selected option label
  const selectedLabel = useMemo(() => {
    const selected = options.find(opt => opt.value === selectedValue);
    return selected ? selected.label : '';
  }, [options, selectedValue]);

  // Handle select click
  const handleSelectClick = (event) => {
    if (disabled || loading) return;
    setAnchorEl(event.currentTarget);
    setOpen(!open);
    setSearchTerm(''); // Clear search when opening
  };

  // Handle option selection
  const handleOptionClick = (optionValue) => {
    setSelectedValue(optionValue);
    onChange(optionValue);
    setOpen(false);
    setSearchTerm('');
  };

  // Handle click away
  const handleClickAway = () => {
    setOpen(false);
    setSearchTerm('');
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    e.stopPropagation();
    setSearchTerm(e.target.value);
  };

  // Sync with external value
  useEffect(() => {
    setSelectedValue(value || '');
  }, [value]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }}>
        {/* Select input */}
        <TextField
          {...props}
          label={label}
          placeholder={placeholder}
          value={selectedLabel}
          onClick={handleSelectClick}
          disabled={disabled || loading}
          error={error}
          helperText={helperText}
          fullWidth={fullWidth}
          size={size}
          InputProps={{
            readOnly: true,
            endAdornment: loading ? (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ) : (
              <InputAdornment position="end">
                <ArrowDropDownIcon 
                  sx={{ 
                    cursor: 'pointer',
                    transform: open ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s'
                  }} 
                />
              </InputAdornment>
            )
          }}
          sx={{
            cursor: 'pointer',
            '& .MuiInputBase-input': {
              cursor: 'pointer'
            }
          }}
        />

        {/* Dropdown popper */}
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="bottom-start"
          style={{
            width: anchorEl?.clientWidth,
            zIndex: 1300
          }}
          modifiers={[
            {
              name: 'flip',
              enabled: false
            },
            {
              name: 'preventOverflow',
              enabled: true,
              options: {
                altAxis: true,
                tether: false
              }
            }
          ]}
        >
          <Paper sx={{ maxHeight: 300, overflow: 'auto', mt: 0.5 }}>
            {/* Search input */}
            <Box sx={{ p: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'action.hover', borderRadius: 1, px: 1 }}>
                <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                <InputBase
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  sx={{ flex: 1, py: 0.5 }}
                  autoFocus
                />
              </Box>
            </Box>

            {/* Options list */}
            <List>
              {loading ? (
                <ListItem disabled>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} />
                    {loadingLabel}
                  </Box>
                </ListItem>
              ) : filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <ListItem
                    key={option.value}
                    onClick={() => handleOptionClick(option.value)}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: option.value === selectedValue ? 'action.selected' : 'transparent',
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                  >
                    {option.label}
                  </ListItem>
                ))
              ) : (
                <ListItem disabled>
                  {noOptionsMessage}
                </ListItem>
              )}
            </List>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default SearchableSelect;