import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  login,
  logout,
  register,
  loadFromStorage,
  updateUserProfile,
  clearError,
} from "../store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select state from Redux
  const {
    user,
    accessToken,
    loading,
    error,
    isAuthenticated: reduxIsAuthenticated,
    uiContext,
    permissions,
  } = useSelector((state) => state.auth);

  // **INDUSTRY STANDARD: Compute isAuthenticated with localStorage fallback**
  const isAuthenticated = useMemo(() => {
    // 1. First check Redux state (for normal app flow)
    if (reduxIsAuthenticated && user && accessToken) {
      return true;
    }
    
    // 2. Fallback: Verify localStorage (for page refresh/scenario)
    const token = localStorage.getItem("access_token");
    const userStr = localStorage.getItem("user");
    
    if (!token || !userStr) {
      return false;
    }
    
    // 3. Optional: Validate token format (basic check)
    try {
      // Check if user data is valid JSON
      JSON.parse(userStr);
      return true;
    } catch (error) {
      console.warn("Invalid user data in localStorage:", error);
      // Clear corrupted data
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      return false;
    }
  }, [reduxIsAuthenticated, user, accessToken]);

  // Actions
  const loginUser = useCallback(
    async (credentials) => {
      try {
        const resultAction = await dispatch(login(credentials));

        if (login.fulfilled.match(resultAction)) {
          return {
            success: true,
            data: resultAction.payload,
            message: "Login successful",
          };
        } else {
          // The thunk was rejected
          return {
            success: false,
            data: null,
            message: resultAction.payload || "Login failed",
          };
        }
      } catch (error) {
        // This catches any unexpected errors
        console.error("loginUser error:", error);
        return {
          success: false,
          data: null,
          message: error.message || "An unexpected error occurred",
        };
      }
    },
    [dispatch],
  );

  const logoutUser = useCallback(async () => {
    await dispatch(logout()).unwrap();
    navigate("/signin");
  }, [dispatch, navigate]);

  const registerUser = useCallback(
    async (userData) => {
      const result = await dispatch(register(userData)).unwrap();
      return result;
    },
    [dispatch],
  );

  const loadAuthState = useCallback(() => {
    dispatch(loadFromStorage());
  }, [dispatch]);

  const updateProfile = useCallback(
    (profileData) => {
      dispatch(updateUserProfile(profileData));
    },
    [dispatch],
  );

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // **INDUSTRY STANDARD: Get user from Redux OR localStorage for fallback**
  const currentUser = useMemo(() => {
    if (user) return user;
    
    // Fallback to localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.warn("Failed to parse user from localStorage:", error);
        return null;
      }
    }
    return null;
  }, [user]);

  // Permission and role checks - use currentUser (with fallback)
  const hasPermission = useCallback(
    (permission) => {
      if (!currentUser?.permissions) return false;
      return currentUser.permissions.includes(permission);
    },
    [currentUser],
  );

  const hasRole = useCallback(
    (role) => {
      if (!currentUser?.role_slugs) return false;
      return currentUser.role_slugs.includes(role);
    },
    [currentUser],
  );

  const canAccess = useCallback(
    (resource, action) => {
      const permission = `${resource}.${action}`;
      return hasPermission(permission);
    },
    [hasPermission],
  );

  // UI Context checks - use currentUser context
  const userUiContext = useMemo(() => {
    return currentUser?.ui_context || uiContext || {};
  }, [currentUser, uiContext]);

  const canAccessDashboard = useCallback(() => {
    return userUiContext.can_access_dashboard || false;
  }, [userUiContext]);

  const canManageEmployees = useCallback(() => {
    return userUiContext.can_manage_employees || false;
  }, [userUiContext]);

  const canManageCandidates = useCallback(() => {
    return userUiContext.can_manage_candidates || false;
  }, [userUiContext]);

  const canViewReports = useCallback(() => {
    return userUiContext.can_view_reports || false;
  }, [userUiContext]);

  const canManageTeam = useCallback(() => {
    return userUiContext.can_manage_team || false;
  }, [userUiContext]);

  const canApproveLeave = useCallback(() => {
    return userUiContext.can_approve_leave || false;
  }, [userUiContext]);

  // Role checks - use currentUser
  const isManager = useCallback(() => {
    return currentUser?.is_manager || userUiContext?.manager || false;
  }, [currentUser, userUiContext]);

  const isEmployee = useCallback(() => {
    return currentUser?.is_employee || false;
  }, [currentUser]);

  const isCandidate = useCallback(() => {
    return currentUser?.is_candidate || false;
  }, [currentUser]);

  const isCompanyOwner = useCallback(() => {
    return currentUser?.is_company_owner || false;
  }, [currentUser]);

  const isPlatformSuperAdmin = useCallback(() => {
    return currentUser?.is_platform_super_admin || false;
  }, [currentUser]);

  // User info getters - use currentUser
  const getFullName = useCallback(() => {
    return (
      currentUser?.full_name ||
      (currentUser?.first_name && currentUser?.last_name
        ? `${currentUser.first_name} ${currentUser.last_name}`
        : "") ||
      currentUser?.employee?.full_name ||
      ""
    );
  }, [currentUser]);

  const getEmployeeCode = useCallback(() => {
    return currentUser?.employee?.employee_code || "";
  }, [currentUser]);

  const getCompanyInfo = useCallback(() => {
    return currentUser?.company || {};
  }, [currentUser]);

  return {
    // State
    user: currentUser, // Return the computed user (with fallback)
    accessToken: accessToken || localStorage.getItem("access_token"),
    loading,
    error,
    isAuthenticated, // **This is the key fix - computed with fallback**
    uiContext: userUiContext,
    permissions: currentUser?.permissions || permissions || [],

    // Actions
    loginUser,
    logoutUser,
    registerUser,
    loadAuthState,
    updateProfile,
    clearAuthError,

    // Permission checks
    hasPermission,
    hasRole,
    canAccess,

    // Role checks
    isManager,
    isEmployee,
    isCandidate,
    isCompanyOwner,
    isPlatformSuperAdmin,

    // UI Context checks
    canAccessDashboard,
    canManageEmployees,
    canManageCandidates,
    canViewReports,
    canManageTeam,
    canApproveLeave,

    // User info
    getFullName,
    getEmployeeCode,
    getCompanyInfo,

    // Computed properties
    isLoggedIn: isAuthenticated,
    userId: currentUser?.id,
    userEmail: currentUser?.email,
    userRoles: currentUser?.role_slugs || [],
    companyId: currentUser?.company?.id,
    employeeId: currentUser?.employee?.id,
  };
};