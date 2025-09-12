import { useCallback, useContext } from 'react';
import { toast } from 'sonner';

import { AuthContext } from '@/auth/context';
import http, { endpoints } from '@/services/api';

export const useAuthLogout = () => {
  const { logout } = useContext(AuthContext);

  return useCallback(async () => {
    try {
      // Try to call the logout endpoint, but don't fail if it doesn't exist
      try {
        await http.post(endpoints.auth.logout);
      } catch (apiError) {
        // If the logout endpoint doesn't exist (404), just continue with local logout
      }

      // Always perform local logout regardless of API response
      logout();

      toast.success('Logged out successfully');
    } catch (error) {
      // Even if there's an error, still perform local logout
      logout();
      toast.success('Logged out successfully');
    }
  }, [logout]);
};
