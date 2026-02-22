// features/auth/hooks/useAuth.js
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  login,
  register,
  forgotPassword,
  resetPassword,
  logout,
  loadFromStorage,
  clearError,
  clearSuccess,
  setEmailForReset,
} from '../../../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    user,
    accessToken,
    loading,
    error,
    validationErrors,
    success,
    isAuthenticated,
    permissions,
    uiContext,
    emailForReset,
    lastErrorCode,
    lastErrorTimestamp
  } = useSelector((state) => state.auth);

  const handleLogin = useCallback(
    async (credentials, redirectTo = '/dashboard') => {
      try {
        const result = await dispatch(login(credentials)).unwrap();
        if (redirectTo) {
          navigate(redirectTo, { replace: true });
        }
        return result;
      } catch (err) {
        // err contains the rejectWithValue payload
        console.error('Login error in hook:', err);
        throw err; // Re-throw for component to handle
      }
    },
    [dispatch, navigate]
  );

  const handleRegister = useCallback(
    async (userData, redirectTo = '/auth/login') => {
      try {
        const result = await dispatch(register(userData)).unwrap();
        if (redirectTo) {
          navigate(redirectTo, {
            state: { message: 'Registration successful! Please login to continue.' }
          });
        }
        return result;
      } catch (err) {
        console.error('Register error in hook:', err);
        throw err;
      }
    },
    [dispatch, navigate]
  );

  const handleForgotPassword = useCallback(
    async (email) => {
      try {
        const result = await dispatch(forgotPassword({ email })).unwrap();
        dispatch(setEmailForReset(email));
        return result;
      } catch (err) {
        console.error('Forgot password error:', err);
        throw err;
      }
    },
    [dispatch]
  );

  const handleResetPassword = useCallback(
    async (data) => {
      try {
        const result = await dispatch(resetPassword(data)).unwrap();
        return result;
      } catch (err) {
        console.error('Reset password error:', err);
        throw err;
      }
    },
    [dispatch]
  );

  const handleLogout = useCallback(
    async (redirectTo = '/auth/login') => {
      try {
        await dispatch(logout()).unwrap();
        if (redirectTo) {
          navigate(redirectTo, { replace: true });
        }
      } catch (err) {
        console.error('Logout error:', err);
        if (redirectTo) {
          navigate(redirectTo, { replace: true });
        }
      }
    },
    [dispatch, navigate]
  );

  const loadAuthState = useCallback(() => {
    dispatch(loadFromStorage());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearAuthSuccess = useCallback(() => {
    dispatch(clearSuccess());
  }, [dispatch]);

  // Helper to check if current error is of a specific type
  const isErrorType = useCallback((code) => {
    return lastErrorCode === code;
  }, [lastErrorCode]);

  // Helper to check if it's a validation error
  const isValidationError = useCallback(() => {
    return lastErrorCode === 422 && Object.keys(validationErrors).length > 0;
  }, [lastErrorCode, validationErrors]);

  return {
    // State
    user,
    accessToken,
    loading,
    error,
    validationErrors,
    success,
    isAuthenticated,
    permissions,
    uiContext,
    emailForReset,
    lastErrorCode,
    lastErrorTimestamp,

    // Actions
    login: handleLogin,
    register: handleRegister,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
    logout: handleLogout,
    loadAuthState,
    clearError: clearAuthError,
    clearSuccess: clearAuthSuccess,

    // Helpers
    isErrorType,
    isValidationError
  };
};