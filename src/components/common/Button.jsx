import React from "react";
import { Button as MuiButton, CircularProgress, Box } from "@mui/material";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  align = "left",
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  sx = {},
  ...props
}) => {
  // Sizes
  const sizeStyles = {
    small: {
      px: 2,
      py: 1,
      fontSize: "0.875rem",
      minHeight: "36px"
    },
    medium: {
      px: 2.5,
      py: 1.2,
      fontSize: "1rem",
      minHeight: "40px"
    },
    large: {
      px: 3,
      py: 1.5,
      fontSize: "1.1rem",
      minHeight: "48px"
    },
  };

  // Color variants
  const variantStyles = {
    primary: {
      backgroundColor: "#226AD3",
      color: "#fff",
      "&:hover": { backgroundColor: "#1a56b0" },
      "&.Mui-disabled": {
        backgroundColor: "#93c5fd",
        color: "#fff",
      }
    },
    secondary: {
      backgroundColor: "#4b5563",
      color: "#fff",
      "&:hover": { backgroundColor: "#374151" },
      "&.Mui-disabled": {
        backgroundColor: "#d1d5db",
        color: "#fff",
      }
    },
    outline: {
      border: "1px solid #226AD3",
      backgroundColor: "transparent",
      color: "#226AD3",
      "&:hover": {
        backgroundColor: "#226AD3",
        color: "#fff",
      },
      "&.Mui-disabled": {
        borderColor: "#93c5fd",
        color: "#93c5fd",
      }
    },
    ghost: {
      color: "#374151",
      backgroundColor: "transparent",
      "&:hover": { backgroundColor: "#f3f4f6" },
      "&.Mui-disabled": {
        color: "#d1d5db",
      }
    },
  };

  // Alignment
  const alignmentStyles = {
    left: {
      justifyContent: "flex-start",
      alignSelf: "flex-start"
    },
    center: {
      justifyContent: "center",
      alignSelf: "center",
      margin: "0 auto",
      display: "flex"
    },
    right: {
      justifyContent: "flex-end",
      alignSelf: "flex-end",
      marginLeft: "auto"
    },
  };

  // Loader color based on variant
  const getLoaderColor = () => {
    if (loading && disabled) return "#9ca3af";
    if (variant === "outline" && !loading) return "#226AD3";
    if (variant === "ghost") return "#374151";
    return "#fff";
  };

  return (
    <MuiButton
      type={type}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      sx={{
        borderRadius: "10px",
        textTransform: "none",
        fontWeight: 500,
        fontFamily: "Poppins, sans-serif",
        position: "relative",
        overflow: "hidden",
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...alignmentStyles[align],
        ...sx,
      }}
      {...props}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          width: "100%",
          visibility: loading ? "hidden" : "visible",
        }}
      >
        {children}
      </Box>

      {/* Loader overlay */}
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress
            size={size === "small" ? 16 : size === "large" ? 22 : 18}
            thickness={4}
            sx={{
              color: getLoaderColor(),
            }}
          />
        </Box>
      )}
    </MuiButton>
  );
};

export default Button;