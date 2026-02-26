import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  Stack
} from '@mui/material';
import SearchableSelect from '../components/common/form/SearchableSelect';

const TestPage = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedValue2, setSelectedValue2] = useState('banana');
  const [selectedValue3, setSelectedValue3] = useState('');
  const [loading, setLoading] = useState(false);

  // Sample options
  const fruitOptions = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
    { value: 'grape', label: 'Grape' },
    { value: 'watermelon', label: 'Watermelon' },
    { value: 'mango', label: 'Mango' },
    { value: 'pineapple', label: 'Pineapple' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'blueberry', label: 'Blueberry' },
    { value: 'raspberry', label: 'Raspberry' },
    { value: 'blackberry', label: 'Blackberry' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'peach', label: 'Peach' },
    { value: 'pear', label: 'Pear' },
    { value: 'plum', label: 'Plum' },
  ];

  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' },
    { value: 'cn', label: 'China' },
    { value: 'in', label: 'India' },
    { value: 'br', label: 'Brazil' },
  ];

  const handleLoadingTest = () => {
    setLoading(true);
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Searchable Select Component Test Page
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Test and demonstrate the SearchableSelect component with various configurations and states.
      </Typography>

      <Grid container spacing={3}>
        {/* Basic Example */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Example
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <SearchableSelect
                value={selectedValue}
                onChange={setSelectedValue}
                options={fruitOptions}
                label="Fruit"
                placeholder="Select a fruit"
                searchPlaceholder="Search fruits..."
                fullWidth
              />
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Selected value: <strong>{selectedValue || 'None'}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Selected label: <strong>
                    {fruitOptions.find(f => f.value === selectedValue)?.label || 'None'}
                  </strong>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* With Default Value */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                With Default Value
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <SearchableSelect
                value={selectedValue2}
                onChange={setSelectedValue2}
                options={fruitOptions}
                label="Fruit (Banana selected)"
                placeholder="Select a fruit"
                searchPlaceholder="Search fruits..."
                fullWidth
              />
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Selected value: <strong>{selectedValue2}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Selected label: <strong>
                    {fruitOptions.find(f => f.value === selectedValue2)?.label}
                  </strong>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Different Sizes */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Different Sizes
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Stack spacing={2}>
                <SearchableSelect
                  value={selectedValue3}
                  onChange={setSelectedValue3}
                  options={countryOptions}
                  label="Small Size"
                  placeholder="Select a country"
                  searchPlaceholder="Search countries..."
                  size="small"
                  fullWidth
                />
                
                <SearchableSelect
                  value={selectedValue3}
                  onChange={setSelectedValue3}
                  options={countryOptions}
                  label="Medium Size (Default)"
                  placeholder="Select a country"
                  searchPlaceholder="Search countries..."
                  size="medium"
                  fullWidth
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* States */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Component States
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Stack spacing={2}>
                <SearchableSelect
                  value=""
                  onChange={() => {}}
                  options={fruitOptions}
                  label="Disabled"
                  placeholder="Cannot select"
                  searchPlaceholder="Search fruits..."
                  disabled
                  fullWidth
                />
                
                <SearchableSelect
                  value=""
                  onChange={() => {}}
                  options={fruitOptions}
                  label="Error State"
                  placeholder="Error example"
                  searchPlaceholder="Search fruits..."
                  error
                  helperText="This field is required"
                  fullWidth
                />
                
                <SearchableSelect
                  value=""
                  onChange={() => {}}
                  options={fruitOptions}
                  label="Loading State"
                  placeholder="Loading..."
                  searchPlaceholder="Search fruits..."
                  loading
                  fullWidth
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Dynamic Loading */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Dynamic Loading
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <SearchableSelect
                value={selectedValue3}
                onChange={setSelectedValue3}
                options={countryOptions}
                label="Countries"
                placeholder="Select a country"
                searchPlaceholder="Search countries..."
                loading={loading}
                fullWidth
              />
              
              <Box sx={{ mt: 2 }}>
                <button 
                  onClick={handleLoadingTest}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Simulate Loading (3 seconds)
                </button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Many Options */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Many Options (Scroll Test)
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <SearchableSelect
                value={selectedValue3}
                onChange={setSelectedValue3}
                options={Array.from({ length: 50 }, (_, i) => ({
                  value: `option-${i + 1}`,
                  label: `Option ${i + 1}`
                }))}
                label="Many Options"
                placeholder="Select an option"
                searchPlaceholder="Search options..."
                fullWidth
              />
              
              <Alert severity="info" sx={{ mt: 2 }}>
                This select has 50 options to test scrolling behavior
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Current Selections Summary */}
      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Current Selections Summary
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2">
              <strong>Basic Example:</strong> {selectedValue || 'Not selected'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2">
              <strong>Default Value:</strong> {selectedValue2}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2">
              <strong>Other Selections:</strong> {selectedValue3 || 'Not selected'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Instructions */}
      <Paper sx={{ mt: 4, p: 3, bgcolor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom>
          How to Test
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Stack spacing={1}>
          <Typography variant="body2">
            1. <strong>Basic Example:</strong> Click to open dropdown and search for fruits
          </Typography>
          <Typography variant="body2">
            2. <strong>With Default Value:</strong> Shows pre-selected banana
          </Typography>
          <Typography variant="body2">
            3. <strong>Different Sizes:</strong> Compare small vs medium size selects
          </Typography>
          <Typography variant="body2">
            4. <strong>Component States:</strong> Test disabled, error, and loading states
          </Typography>
          <Typography variant="body2">
            5. <strong>Dynamic Loading:</strong> Click button to simulate loading state
          </Typography>
          <Typography variant="body2">
            6. <strong>Many Options:</strong> Test scrolling with 50 options
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
};

export default TestPage;