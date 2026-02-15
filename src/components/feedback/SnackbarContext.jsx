import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Snackbar, Alert, LinearProgress, Slide, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

// Smooth slide-in transition
function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

// Gradient progress bar
const ProgressBar = styled(LinearProgress)(({ theme, severity }) => ({
  height: 4,
  borderRadius: 3,
  backgroundColor: "transparent",
  "& .MuiLinearProgress-bar": {
    borderRadius: 3,
    backgroundImage: `linear-gradient(90deg, 
      ${theme.palette[severity]?.light || theme.palette.success.light}, 
      ${theme.palette[severity]?.main || theme.palette.success.main}
    )`,
    transition: "transform 0.2s linear",
  },
}));

// Modern card wrapper
const SnackbarCard = styled(Paper)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: theme.shadows[6],
  overflow: "hidden",
  minWidth: 300,
  cursor: "default",
}));

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const DURATION = 2000

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [progress, setProgress] = useState(100);

  const rafId = useRef(null);
  const remainingTime = useRef(DURATION);
  const lastTick = useRef(null);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
    setProgress(100);
    remainingTime.current = DURATION;
  };

  const hideSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
    setProgress(100);
    cancelAnimationFrame(rafId.current);
    remainingTime.current = DURATION;
  };

  // Core ticker using rAF
  const tick = () => {
    const now = Date.now();
    const delta = now - lastTick.current;
    lastTick.current = now;

    remainingTime.current -= delta;

    const percent = Math.max((remainingTime.current / DURATION) * 100, 0);
    setProgress(percent);

    if (remainingTime.current <= 0) {
      cancelAnimationFrame(rafId.current);
      hideSnackbar();
    } else {
      rafId.current = requestAnimationFrame(tick);
    }
  };

  // Start countdown
  const startCountdown = () => {
    cancelAnimationFrame(rafId.current);
    lastTick.current = Date.now();
    rafId.current = requestAnimationFrame(tick);
  };

  // Pause
  const pauseCountdown = () => {
    cancelAnimationFrame(rafId.current);
  };

  // Resume
  const resumeCountdown = () => {
    lastTick.current = Date.now();
    rafId.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (snackbar.open) startCountdown();
    return () => cancelAnimationFrame(rafId.current);
  }, [snackbar.open]);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      <Snackbar
        open={snackbar.open}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={SlideTransition}
        transitionDuration={400}
        sx={{
          top: "68px !important" ,
          right: "5px !important"
        }}
      >
        <SnackbarCard
          elevation={6}
          onMouseEnter={pauseCountdown}
          onMouseLeave={resumeCountdown}
        >
          <Alert
            severity={snackbar.severity}
            onClose={hideSnackbar}
            variant="standard"
            sx={{
              borderRadius: 0,
              fontWeight: 500,
              backgroundColor: "transparent",
              "& .MuiAlert-icon": {
                fontSize: 22,
              },
              "& .MuiAlert-message": {
                fontSize: "0.95rem",
              },
            }}
          >
            {snackbar.message}
          </Alert>
          <ProgressBar
            variant="determinate"
            value={progress}
            severity={snackbar.severity}
          />
        </SnackbarCard>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) throw new Error("useSnackbar must be used within SnackbarProvider");
  return context;
};
