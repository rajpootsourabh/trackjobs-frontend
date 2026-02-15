import React, { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, Alert, Stack } from "@mui/material";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, severity = "info") => {
    const id = Date.now();

    setToasts((prev) => [
      ...prev,
      { id, message, severity }
    ]);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <Stack
        spacing={1}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
        }}
      >
        {toasts.map((toast) => (
          <Snackbar
            key={toast.id}
            open
            autoHideDuration={4000}
            onClose={() => removeToast(toast.id)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              onClose={() => removeToast(toast.id)}
              severity={toast.severity}
              variant="filled"
              sx={{
                minWidth: 280,
                borderRadius: 2,
                fontWeight: 500,
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
              }}
            >
              {toast.message}
            </Alert>
          </Snackbar>
        ))}
      </Stack>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
