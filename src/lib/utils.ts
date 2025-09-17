import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import cookies from 'js-cookie';

import { paths } from '@/routes/paths';
import http from '@/services/api';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(decimals)} ${
    sizeType === 'accurate' ? accurateSizes[i] ?? 'Bytes' : sizes[i] ?? 'Bytes'
  }`;
}

function jwtDecode(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}

export const isValidToken = (access_token: string) => {
  if (!access_token) {
    return false;
  }

  const decoded = jwtDecode(access_token);

  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

export const tokenExpired = (exp: number) => {
  const currentTime = Date.now();

  const timeLeft = exp * 1000 - currentTime;

  const expiredTimer = setTimeout(() => {
    alert('Token expired');

    localStorage.removeItem('access_token');

    window.location.href = paths.auth.jwt.login;
  }, timeLeft);

  clearTimeout(expiredTimer);
};

export const setSession = (access_token: string | null) => {
  if (access_token) {
    http.defaults.headers.common.Authorization = `Bearer ${access_token}`;
  } else {
    // Clear localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userData');
    
    // Clear cookies
    cookies.remove('m_at');
    cookies.remove('m_rt');

    delete http.defaults.headers.common.Authorization;
  }
};
