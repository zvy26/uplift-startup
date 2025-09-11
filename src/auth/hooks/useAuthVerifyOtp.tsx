import { useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { AuthContext } from "@/auth/context";
import { IVerifyOtpCode, Types } from "@/auth/types";
import http, { endpoints } from "@/services/api";

export const useAuthVerifyOtp = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  return useCallback(async (values: IVerifyOtpCode) => {
    try {
      const res = await http.post(endpoints.auth.verify_phone_otp, values);
      const { data } = res.data;

      dispatch({
        type: Types.VERIFY_PHONE_OTP,
        payload: { ...data },
      });

      toast.success("SmsOtp code successfully verified.");

      navigate(`/auth/sign-up-phone?phone=998123456789`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error verifying SmsOtp code",
      );
    }
  }, []);
};
