import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';


import {
  Box,
  Typography,
  Breadcrumbs,
  Paper
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const PageHeader = ({
  breadcrumb = [],
  title,
  subtitle,
  actions
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        mb: 3,
        backgroundColor: 'transparent',
      }}
    >
      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 1 }}
        >
          {breadcrumb.map((item, index) =>
            item.path ? (
              <Link
                component={RouterLink}
                to={item.path}
                underline="none"
                sx={{
                  fontSize: 14,
                  color: '#6b7280',
                  transition: 'color 0.2s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'grey.800'
                    // textDecoration: 'underline'
                  }
                }}
              >
                {item.label}
              </Link>

            ) : (
              <Typography
                key={index}
                fontSize={14}
                color={item.current ? 'text.primary' : 'text.secondary'}
                fontWeight={item.current ? 500 : 400}
              >
                {item.label}
              </Typography>
            )
          )}
        </Breadcrumbs>
      )}

      {/* Title + Actions */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          {title && (
            <Typography variant="h5"
              sx={{ mt: 1 }}
              fontWeight={600}>
              {title}
            </Typography>
          )}

          {subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {actions && (
          <Box display="flex" alignItems="center" gap={1.5}>
            {actions}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default PageHeader;
