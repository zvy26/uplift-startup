import { useAuthContext } from '@/auth/hooks/useAuthContext';
import http from '@/services/api';
import { useQuery } from '@tanstack/react-query';

export const useGetTrial = () => {
  const { user } = useAuthContext();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['trial'],
    enabled: !!user,
    queryFn: async () => {
      try {
        const res = await http.get(`/user-plans`).then(r => r.data);
        // Handle array response from user-plans
        const payload = Array.isArray(res?.data) ? res.data[0] : (res?.data ?? res);
        return {
          _id: payload?._id ?? '',
          user: payload?.user ?? '',
          plan: payload?.plan ?? '',
          freeTrialCount: payload?.freeTrialCount ?? 0,
          premiumTrialCount: payload?.premiumTrialCount ?? 0,
          hasPaidPlan: payload?.hasPaidPlan ?? Boolean(payload),
          submissionsUsed: payload?.submissionsUsed ?? 0,
          submissionsLimit: payload?.submissionsLimit ?? 0,
          remainingSubmissions: Math.max(0, (payload?.submissionsLimit ?? 0) - (payload?.submissionsUsed ?? 0)),
        } as {
          _id: string;
          user: string;
          plan: string;
          freeTrialCount: number;
          premiumTrialCount: number;
          hasPaidPlan: boolean;
          submissionsUsed: number;
          submissionsLimit: number;
          remainingSubmissions: number;
        };
      } catch (err: any) {
        // 404: User plan not found → fall back to free tier defaults
        if (err?.response?.status === 404) {
          return {
            _id: '',
            user: user?._id ?? '',
            plan: '',
            freeTrialCount: 0,
            premiumTrialCount: 0,
            hasPaidPlan: false,
            submissionsUsed: 0,
            submissionsLimit: 0,
            remainingSubmissions: 0,
          } as {
            _id: string;
            user: string;
            plan: string;
            freeTrialCount: number;
            premiumTrialCount: number;
            hasPaidPlan: boolean;
            submissionsUsed: number;
            submissionsLimit: number;
            remainingSubmissions: number;
          };
        }
        throw err;
      }
    },
    retry: false,
  });

  return { data, isLoading, isError };
};
