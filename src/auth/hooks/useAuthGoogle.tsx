import { useCallback } from "react";
import { toast } from "sonner";

export const useAuthGoogle = () => {
  return useCallback(async () => {
    try {
      window.location.href =
        "https://backend-template.qisqa.link/api/auth/google/callback";
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error initiating Google sign-in",
      );
    }
  }, []);
};
