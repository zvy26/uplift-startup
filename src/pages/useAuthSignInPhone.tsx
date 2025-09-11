import { useCallback, useContext } from 'react';
import { toast } from 'sonner';

import { AuthContext } from '@/auth/context';
import { ISignInWithPhone, Types } from '@/auth/types';
import http, { endpoints } from '@/services/api';

export const useAuthSignInPhone = () => {
  const { dispatch } = useContext(AuthContext);

  return useCallback(
    async (values: ISignInWithPhone) => {
      try {
        const res = await http.post(endpoints.auth.sign_in_phone, values);

        dispatch({
          type: Types.SIGN_UP_WITH_PHONE,
          payload: { user: res.data.profile },
        });

        toast.success('Tizimga kirildi');

        window.location.assign('/dashboard');
      } catch (error) {
        toast.error(
          error.response?.data?.message || 'Tizimga kirishda xatolik yuz berdi!'
        );
      }
    },
    [dispatch]
  );
};
