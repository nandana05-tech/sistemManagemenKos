import { useAuthStore } from '../features/auth/authStore';

/**
 * Custom hook for authentication
 */
export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    fetchUser,
    updateUserProfile,
    hasRole,
    isPemilik,
    isPenghuni,
    clearError,
  } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    fetchUser,
    updateUserProfile,
    hasRole,
    isPemilik: isPemilik(),
    isPenghuni: isPenghuni(),
    clearError,
  };
};

export default useAuth;
