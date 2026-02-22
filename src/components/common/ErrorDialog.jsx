// components/common/feedback/ErrorDialog.jsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Fade,
  Chip,
  Avatar,
  Slide,
  Paper
} from "@mui/material";
import {
  Close as CloseIcon,
  ErrorOutline as ErrorIcon,
  WarningAmber as WarningIcon,
  InfoOutlined as InfoIcon,
  CheckCircleOutline as SuccessIcon,
  LockOutlined as LockIcon,
  ReportProblemOutlined as ReportIcon,
  AssignmentLateOutlined as ServerIcon,
  CloudOff as OfflineIcon,
  VisibilityOff as HiddenIcon,
  GppBadOutlined as ForbiddenIcon,
  SearchOffOutlined as NotFoundIcon,
  HourglassEmptyOutlined as TimeoutIcon,
  ThumbDownOffAltOutlined as BadRequestIcon,
  PaymentOutlined as PaymentIcon,
  RateReviewOutlined as TooManyRequestsIcon,
  ArchitectureOutlined as ConflictIcon,
  HttpOutlined as HttpIcon,
  BugReportOutlined as BugIcon,
  ShieldOutlined as UnauthorizedIcon,
  KeyOffOutlined as InvalidTokenIcon,
  AnnouncementOutlined as MaintenanceIcon,
  WifiOffOutlined as ConnectionIcon,
  SecurityOutlined as SecurityIcon,
  UpgradeOutlined as UpgradeIcon,
  WarningAmberOutlined as WarningOutlinedIcon,
  GppBadOutlined,
  CloudSyncOutlined,
  StorageOutlined
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";

// Slide transition for smoother appearance
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Complete HTTP Status Code Configuration
const HTTP_STATUS_CONFIG = {
  // 1xx Informational
  100: { title: "Continue", icon: InfoIcon, color: "info", type: "info" },
  101: { title: "Switching Protocols", icon: InfoIcon, color: "info", type: "info" },
  102: { title: "Processing", icon: InfoIcon, color: "info", type: "info" },
  103: { title: "Early Hints", icon: InfoIcon, color: "info", type: "info" },

  // 2xx Success
  200: { title: "Success", icon: SuccessIcon, color: "success", type: "success" },
  201: { title: "Created", icon: SuccessIcon, color: "success", type: "success" },
  202: { title: "Accepted", icon: SuccessIcon, color: "success", type: "success" },
  203: { title: "Non-Authoritative Information", icon: InfoIcon, color: "info", type: "info" },
  204: { title: "No Content", icon: InfoIcon, color: "info", type: "info" },
  205: { title: "Reset Content", icon: InfoIcon, color: "info", type: "info" },
  206: { title: "Partial Content", icon: InfoIcon, color: "info", type: "info" },

  // 3xx Redirection
  300: { title: "Multiple Choices", icon: InfoIcon, color: "warning", type: "redirect" },
  301: { title: "Moved Permanently", icon: InfoIcon, color: "warning", type: "redirect" },
  302: { title: "Found", icon: InfoIcon, color: "warning", type: "redirect" },
  303: { title: "See Other", icon: InfoIcon, color: "warning", type: "redirect" },
  304: { title: "Not Modified", icon: InfoIcon, color: "info", type: "info" },
  307: { title: "Temporary Redirect", icon: InfoIcon, color: "warning", type: "redirect" },
  308: { title: "Permanent Redirect", icon: InfoIcon, color: "warning", type: "redirect" },

  // 4xx Client Errors
  400: {
    title: "Bad Request",
    icon: BadRequestIcon,
    color: "warning",
    type: "client",
    description: "The request could not be understood by the server"
  },
  401: {
    title: "Unauthorized",
    icon: UnauthorizedIcon,
    color: "error",
    type: "auth",
    description: "Authentication is required or has failed"
  },
  402: {
    title: "Payment Required",
    icon: PaymentIcon,
    color: "warning",
    type: "payment",
    description: "Payment is required to access this resource"
  },
  403: {
    title: "Forbidden",
    icon: ForbiddenIcon,
    color: "error",
    type: "auth",
    description: "You don't have permission to access this resource"
  },
  404: {
    title: "Not Found",
    icon: NotFoundIcon,
    color: "warning",
    type: "client",
    description: "The requested resource could not be found"
  },
  405: {
    title: "Method Not Allowed",
    icon: HttpIcon,
    color: "warning",
    type: "client",
    description: "The HTTP method is not supported for this resource"
  },
  406: {
    title: "Not Acceptable",
    icon: WarningIcon,
    color: "warning",
    type: "client",
    description: "The server cannot produce a response matching the acceptable values"
  },
  407: {
    title: "Proxy Authentication Required",
    icon: LockIcon,
    color: "error",
    type: "auth",
    description: "Proxy authentication is required"
  },
  408: {
    title: "Request Timeout",
    icon: TimeoutIcon,
    color: "warning",
    type: "timeout",
    description: "The server timed out waiting for the request"
  },
  409: {
    title: "Conflict",
    icon: ConflictIcon,
    color: "warning",
    type: "client",
    description: "The request conflicts with the current state of the server"
  },
  410: {
    title: "Gone",
    icon: NotFoundIcon,
    color: "warning",
    type: "client",
    description: "The requested content has been permanently deleted"
  },
  411: {
    title: "Length Required",
    icon: InfoIcon,
    color: "warning",
    type: "client",
    description: "Content-Length header is required"
  },
  412: {
    title: "Precondition Failed",
    icon: WarningIcon,
    color: "warning",
    type: "client",
    description: "Precondition given in the request failed"
  },
  413: {
    title: "Payload Too Large",
    icon: ErrorIcon,
    color: "warning",
    type: "client",
    description: "Request entity is larger than limits defined by server"
  },
  414: {
    title: "URI Too Long",
    icon: ErrorIcon,
    color: "warning",
    type: "client",
    description: "The URI requested is too long for the server to process"
  },
  415: {
    title: "Unsupported Media Type",
    icon: ErrorIcon,
    color: "warning",
    type: "client",
    description: "The media format is not supported by the server"
  },
  416: {
    title: "Range Not Satisfiable",
    icon: ErrorIcon,
    color: "warning",
    type: "client",
    description: "The requested range is not valid"
  },
  417: {
    title: "Expectation Failed",
    icon: ErrorIcon,
    color: "warning",
    type: "client",
    description: "The expectation given in the request header could not be met"
  },
  418: {
    title: "I'm a teapot",
    icon: WarningIcon,
    color: "warning",
    type: "fun",
    description: "The server refuses to brew coffee because it is a teapot"
  },
  421: {
    title: "Misdirected Request",
    icon: ErrorIcon,
    color: "warning",
    type: "client",
    description: "The request was directed at a server that cannot produce a response"
  },
  422: {
    title: "Unprocessable Entity",
    icon: ReportIcon,
    color: "warning",
    type: "validation",
    description: "The request was well-formed but contains semantic errors"
  },
  423: {
    title: "Locked",
    icon: LockIcon,
    color: "warning",
    type: "client",
    description: "The resource that is being accessed is locked"
  },
  424: {
    title: "Failed Dependency",
    icon: ErrorIcon,
    color: "warning",
    type: "client",
    description: "The request failed due to failure of a previous request"
  },
  425: {
    title: "Too Early",
    icon: WarningIcon,
    color: "warning",
    type: "client",
    description: "The server is unwilling to risk processing a request that might be replayed"
  },
  426: {
    title: "Upgrade Required",
    icon: UpgradeIcon,
    color: "warning",
    type: "client",
    description: "The client should switch to a different protocol"
  },
  428: {
    title: "Precondition Required",
    icon: WarningIcon,
    color: "warning",
    type: "client",
    description: "The origin server requires the request to be conditional"
  },
  429: {
    title: "Too Many Requests",
    icon: TooManyRequestsIcon,
    color: "warning",
    type: "rate-limit",
    description: "You have sent too many requests in a given amount of time"
  },
  431: {
    title: "Request Header Fields Too Large",
    icon: ErrorIcon,
    color: "warning",
    type: "client",
    description: "The server is unwilling to process the request because headers are too large"
  },
  451: {
    title: "Unavailable For Legal Reasons",
    icon: GppBadOutlined,
    color: "error",
    type: "legal",
    description: "The resource is unavailable due to legal demands"
  },

  // 5xx Server Errors
  500: {
    title: "Internal Server Error",
    icon: ServerIcon,
    color: "error",
    type: "server",
    description: "The server encountered an unexpected condition"
  },
  501: {
    title: "Not Implemented",
    icon: BugIcon,
    color: "error",
    type: "server",
    description: "The server does not support the functionality required"
  },
  502: {
    title: "Bad Gateway",
    icon: CloudSyncOutlined,
    color: "error",
    type: "network",
    description: "The server received an invalid response from the upstream server"
  },
  503: {
    title: "Service Unavailable",
    icon: MaintenanceIcon,
    color: "error",
    type: "maintenance",
    description: "The server is not ready to handle the request"
  },
  504: {
    title: "Gateway Timeout",
    icon: TimeoutIcon,
    color: "error",
    type: "timeout",
    description: "The server did not receive a timely response from the upstream server"
  },
  505: {
    title: "HTTP Version Not Supported",
    icon: HttpIcon,
    color: "error",
    type: "server",
    description: "The HTTP version used in the request is not supported"
  },
  506: {
    title: "Variant Also Negotiates",
    icon: ErrorIcon,
    color: "error",
    type: "server",
    description: "The server has an internal configuration error"
  },
  507: {
    title: "Insufficient Storage",
    icon: StorageOutlined,
    color: "error",
    type: "server",
    description: "The server is unable to store the representation needed to complete the request"
  },
  508: {
    title: "Loop Detected",
    icon: ErrorIcon,
    color: "error",
    type: "server",
    description: "The server detected an infinite loop while processing the request"
  },
  510: {
    title: "Not Extended",
    icon: ErrorIcon,
    color: "error",
    type: "server",
    description: "Further extensions to the request are required"
  },
  511: {
    title: "Network Authentication Required",
    icon: SecurityIcon,
    color: "error",
    type: "auth",
    description: "The client needs to authenticate to gain network access"
  },

  // Network/Client-side Errors (non-HTTP)
  NETWORK_ERROR: {
    title: "Network Error",
    icon: ConnectionIcon,
    color: "error",
    type: "network",
    description: "Unable to connect to the server. Please check your internet connection"
  },
  TIMEOUT: {
    title: "Connection Timeout",
    icon: TimeoutIcon,
    color: "warning",
    type: "timeout",
    description: "The connection to the server timed out"
  },
  CORS_ERROR: {
    title: "CORS Error",
    icon: SecurityIcon,
    color: "error",
    type: "security",
    description: "Cross-Origin Resource Sharing policy prevents access"
  },
  UNKNOWN: {
    title: "Unknown Error",
    icon: BugIcon,
    color: "warning",
    type: "unknown",
    description: "An unexpected error occurred"
  }
};

const ErrorDialog = ({
  open,
  onClose,
  error,
  title,
  actions,
  showIcon = true,
  maxWidth = "sm",
  fullWidth = true,
  onAction,
  variant = "default",
  position = "center",
  showDescription = true
}) => {

  // Parse error data
  const errorData = error?.response?.data || error || {};
  const {
    message,
    errors: validationErrors,
    code,
    timestamp,
    error_code,
    success
  } = errorData;

  // Determine if it's a network error (no response)
  const isNetworkError = !code && error?.message?.includes('Network');
  const isTimeoutError = !code && error?.message?.includes('timeout');
  const isCorsError = !code && error?.message?.includes('CORS');

  // Get status code config
  let statusConfig;
  if (isNetworkError) {
    statusConfig = HTTP_STATUS_CONFIG.NETWORK_ERROR;
  } else if (isTimeoutError) {
    statusConfig = HTTP_STATUS_CONFIG.TIMEOUT;
  } else if (isCorsError) {
    statusConfig = HTTP_STATUS_CONFIG.CORS_ERROR;
  } else {
    statusConfig = HTTP_STATUS_CONFIG[code] || HTTP_STATUS_CONFIG.UNKNOWN;
  }

  const {
    title: configTitle,
    icon: ConfigIcon,
    color,
    type,
    description
  } = statusConfig;

  const isValidationError = code === 422 && validationErrors;

  const getAvatarBg = () => {
    return (theme) => alpha(theme.palette[color].main, 0.08);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return timestamp;
    }
  };

  // Default actions based on error type
  const getDefaultActions = () => {
    switch (type) {
      case 'auth':
        return [
          {
            label: 'Try Again',
            onClick: () => onAction?.('retry'),
            variant: 'contained',
            color: 'error'
          },
          {
            label: 'Reset Password',
            onClick: () => onAction?.('reset-password'),
            variant: 'outlined',
            color: 'error'
          }
        ];
      case 'network':
      case 'timeout':
        return [
          {
            label: 'Retry',
            onClick: () => onAction?.('retry'),
            variant: 'contained',
            color: color
          },
          {
            label: 'Close',
            onClick: onClose,
            variant: 'outlined',
            color: 'inherit'
          }
        ];
      case 'rate-limit':
        return [
          {
            label: 'Try Again Later',
            onClick: onClose,
            variant: 'contained',
            color: color
          }
        ];
      case 'maintenance':
        return [
          {
            label: 'Refresh',
            onClick: () => window.location.reload(),
            variant: 'contained',
            color: color
          },
          {
            label: 'Contact Support',
            onClick: () => onAction?.('support'),
            variant: 'outlined',
            color: color
          }
        ];
      default:
        return [
          {
            label: 'Try Again',
            onClick: () => onAction?.('retry'),
            variant: 'contained',
            color: color
          },
          {
            label: 'Close',
            onClick: onClose,
            variant: 'outlined',
            color: 'inherit'
          }
        ];
    }
  };

  const finalActions = actions || getDefaultActions();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      TransitionComponent={Transition}
      TransitionProps={{ timeout: 400 }}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 4,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          overflow: 'hidden'
        }
      }}
      PaperProps={{
        sx: {
          background: (theme) => `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
          backdropFilter: 'blur(10px)'
        }
      }}
    >
      {/* Header with gradient line */}
      <Box
        sx={{
          height: 4,
          background: (theme) => `linear-gradient(90deg, ${theme.palette[color].main}, ${alpha(theme.palette[color].main, 0.3)})`
        }}
      />

      <DialogContent sx={{ p: 4, pb: 2 }}>
        {/* Close button */}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: 'absolute',
            right: 12,
            top: 16,
            color: 'text.secondary',
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12)
            }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        {/* Icon and Title */}
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          {showIcon && ConfigIcon && (
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: getAvatarBg(),
                color: `${color}.main`
              }}
            >
              <ConfigIcon sx={{ fontSize: 28 }} />
            </Avatar>
          )}
          <Box>
            <Typography variant="h6" fontWeight={700} gutterBottom={false}>
              {title || configTitle}
            </Typography>
            {code && (
              <Box display="flex" gap={1} mt={0.5}>
                <Chip
                  label={`HTTP ${code}`}
                  size="small"
                  color={color}
                  variant="outlined"
                  sx={{ height: 20, '& .MuiChip-label': { px: 1, fontSize: '0.625rem' } }}
                />
                {error_code && (
                  <Chip
                    label={error_code}
                    size="small"
                    color="warning"
                    variant="outlined"
                    sx={{ height: 20, '& .MuiChip-label': { px: 1, fontSize: '0.625rem' } }}
                  />
                )}
              </Box>
            )}
          </Box>
        </Box>

        {/* Description (from status config) */}
        {showDescription && description && !message && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, fontStyle: 'italic' }}
          >
            {description}
          </Typography>
        )}

        {/* Main Message */}
        {message && (
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              mb: validationErrors ? 3 : 2,
              bgcolor: (theme) => alpha(theme.palette[color].main, 0.02),
              borderColor: (theme) => alpha(theme.palette[color].main, 0.2),
              borderRadius: 2
            }}
          >
            <Typography variant="body1" color="text.primary" fontWeight={500}>
              {message}
            </Typography>
          </Paper>
        )}

        {/* Validation Errors */}
        {isValidationError && validationErrors && (
          <Fade in timeout={300}>
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 2, fontWeight: 600, letterSpacing: 0.3 }}
              >
                Please fix the following:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {Object.entries(validationErrors).map(([field, messages], idx) => (
                  <Paper
                    key={field}
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderColor: (theme) => alpha(theme.palette.warning.main, 0.2),
                      bgcolor: (theme) => alpha(theme.palette.warning.main, 0.02),
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'warning.main',
                        bgcolor: (theme) => alpha(theme.palette.warning.main, 0.04)
                      }
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        color: 'warning.main',
                        display: 'block',
                        mb: 0.5
                      }}
                    >
                      {field.replace(/_/g, ' ')}
                    </Typography>
                    {Array.isArray(messages) ? (
                      messages.map((msg, i) => (
                        <Typography
                          key={i}
                          variant="body2"
                          color="text.primary"
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'warning.main', display: 'inline-block', mr: 1 }} />
                          {msg}
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.primary">
                        {messages}
                      </Typography>
                    )}
                  </Paper>
                ))}
              </Box>
            </Box>
          </Fade>
        )}

        {/* Timestamp */}
        {timestamp && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.625rem' }}>
              {formatTimestamp(timestamp)}
            </Typography>
          </Box>
        )}
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 4, pb: 4, gap: 1 }}>
        {finalActions.map((action, index) => (
          <Button
            key={index}
            onClick={() => {
              action.onClick();
              if (action.closeOnClick !== false) {
                onClose();
              }
            }}
            variant={action.variant || 'outlined'}
            color={action.color || color}
            size="large"
            fullWidth={finalActions.length === 1}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              py: 1,
              ...(action.variant === 'contained' && {
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 8px 16px -6px rgba(0,0,0,0.2)'
                }
              })
            }}
          >
            {action.label}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
};

export default ErrorDialog;