import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { plansAPI } from '../plansAPI';
import { toast } from 'sonner';

export const useGetPlans = () => {
  return useQuery({
    queryKey: ['plans'],
    queryFn: plansAPI.getPlans,
  });
};

export const useCreateOrderPayme = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: plansAPI.createOrder,
    onSuccess: session => {
      if (session.paymentProvider === 'PAYME') {
        window.location.href = `https://checkout.paycom.uz/${btoa(
          `m=${import.meta.env.VITE_PAYME_M_ID};ac.order_id=${session._id};a=${
            session.totalPrice * 100
          }`
        )}`;
      } else if (session.paymentProvider === 'CLICK') {
        window.location.href = `https://my.click.uz/services/pay?service_id=${
          import.meta.env.VITE_BASE_URL
        }&merchant_id=${import.meta.env.VITE_BASE_URL}&amount=${
          session.totalPrice * 100
        }&transaction_param=${session._id}`;
      }
      toast.success(
        'Order created successfully. You are being redirected to the payment page.'
      );
      // Invalidate and refetch plans data after successful order creation
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['all-plans'] });
    },
    onError: error => {
      toast.error('Failed to create order. Please try again.');
    },
  });
};

export const useCreateOrderClick = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: plansAPI.createOrder,
    onSuccess: session => {
      // Redirect to Click payment page with proper parameters
      window.location.href = `https://my.click.uz/services/pay?service_id=65090&merchant_id=34393&amount=${session.totalPrice}&transaction_param=${session._id}`;

      toast.success(
        'Order created successfully. You are being redirected to Click payment page.'
      );
      // Invalidate and refetch plans data after successful order creation
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['all-plans'] });
    },
    onError: error => {
      toast.error('Failed to create order. Please try again.');
    },
  });
};
