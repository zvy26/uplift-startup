import { useMutation } from '@tanstack/react-query';
import { authAPI } from '@/modules/auth/authAPI';
import { tokenService } from '@/auth/services/tokenService';
import cookies from 'js-cookie';
import { setSession } from '@/lib/utils';

interface LoginOtpResponse {
  success: boolean;
  message: string;
  data?: {
    phone: string;
  };
}

interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      phone: string;
      name: string;
      avatar?: string;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

interface LoginOtpRequest {
  phone: string;
}

interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

// Hook for sending verification code
export const useLoginOtp = () => {
  return useMutation({
    mutationFn: async (data: LoginOtpRequest): Promise<LoginOtpResponse> => {
      const response = await authAPI.sendVerificationCode(data.phone);
      return response;
    },
    onError: (error: any) => {
      console.error('Login OTP error:', error);
    },
  });
};

// Hook for verifying phone with code
export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
      const response = await authAPI.verifyPhone(data.phone, data.otp);
      return response;
    },
    onSuccess: async (data: VerifyOtpResponse | any) => {
      // Robust token persistence for multiple backend shapes
      // Supported shapes:
      // 1) data.data.tokens.{accessToken,refreshToken}
      // 2) data.data.{accessToken,refreshToken}
      // 3) data.{accessToken,refreshToken}
      const tokens = data?.data?.tokens as
        | { accessToken?: string; refreshToken?: string }
        | { access_token?: string; refresh_token?: string }
        | undefined;

      const accessToken =
        (tokens as any)?.accessToken ??
        (tokens as any)?.access_token ??
        data?.data?.accessToken ??
        data?.data?.access_token ??
        data?.accessToken ??
        data?.access_token;

      const refreshToken =
        (tokens as any)?.refreshToken ??
        (tokens as any)?.refresh_token ??
        data?.data?.refreshToken ??
        data?.data?.refresh_token ??
        data?.refreshToken ??
        data?.refresh_token;

      if (accessToken) {
        // Cookies (used by tokenService/AuthProvider)
        cookies.set('m_at', accessToken);
        if (refreshToken) cookies.set('m_rt', refreshToken);

        // LocalStorage (used by axios interceptor)
        localStorage.setItem('access_token', accessToken);
        if (refreshToken) localStorage.setItem('refresh_token', refreshToken);

        // Apply header immediately
        setSession(accessToken);

        // User profile: store provided or fetch from /auth/me
        const user = data?.data?.user
          ? data.data.user
          : await authAPI
              .me()
              .then(res => (res?.data?.user ?? res?.data ?? res))
              .catch(() => null);
        if (user) localStorage.setItem('userData', JSON.stringify(user));
      }
    },
    onError: (error: any) => {
      console.error('Verify OTP error:', error);
    },
  });
};

// Hook for Google sign-in (placeholder for future implementation)
export const useGoogleSignIn = () => {
  return useMutation({
    mutationFn: async (): Promise<any> => {
      // This would be replaced with actual Google OAuth implementation
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              user: {
                id: 'google-1',
                phone: '+1 234-567-8900',
                name: 'Google User',
                avatar: 'https://via.placeholder.com/40',
              },
              tokens: {
                accessToken: 'google-jwt-token',
                refreshToken: 'google-refresh-token',
              },
            },
          });
        }, 1500);
      });
    },
    onSuccess: (data: any) => {
      if (data.data?.tokens) {
        localStorage.setItem('authToken', data.data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.data.tokens.refreshToken);

        if (data.data.user) {
          localStorage.setItem('userData', JSON.stringify(data.data.user));
        }
      }
    },
    onError: (error: any) => {
      console.error('Google sign-in error:', error);
    },
  });
};

// Hook for demo login (placeholder)
export const useDemoLogin = () => {
  return useMutation({
    mutationFn: async (): Promise<any> => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              user: {
                id: 'demo-1',
                phone: '+1 555-0123',
                name: 'Demo User',
                avatar: null,
              },
              tokens: {
                accessToken: 'demo-jwt-token',
                refreshToken: 'demo-refresh-token',
              },
            },
          });
        }, 1000);
      });
    },
    onSuccess: (data: any) => {
      if (data.data?.tokens) {
        localStorage.setItem('authToken', data.data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.data.tokens.refreshToken);

        if (data.data.user) {
          localStorage.setItem('userData', JSON.stringify(data.data.user));
        }
      }
    },
    onError: (error: any) => {
      console.error('Demo login error:', error);
    },
  });
};
