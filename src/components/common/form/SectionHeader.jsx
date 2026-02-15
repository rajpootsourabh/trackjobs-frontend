import { Box, Typography, Button } from '@mui/material';

const SectionHeader = ({ number, title, rightAction }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            bgcolor: '#2563eb',
            color: '#fff',
            px: 1.5,
            py: 0.3,
            borderRadius: 1,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {number}
        </Box>

        <Typography variant="h7" sx={{ fontWeight: 400 }}>
          {title}
        </Typography>
      </Box>

      {rightAction && rightAction}
    </Box>
  );
};

export default SectionHeader;
