import { useQuery } from '@tanstack/react-query';
import { plansAPI } from '@/modules/plan/plansAPI';

export const useGetPlans = () => {
  return useQuery({
    queryKey: ['plans'],
    queryFn: plansAPI.getPlans,
  });
};
